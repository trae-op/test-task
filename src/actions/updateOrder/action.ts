'use server';

import { revalidateTag } from 'next/cache';

import type { TLocationFormValue } from '@/types/location';

import { findChangedProducts } from '@/utils/products';
import { getUserSession } from '@/utils/session';

import type { TUpdateOrderResult, TUpdateOrderSubmitState } from './types';
import { prisma } from '@/prisma/prisma-client';

const parseLocation = (
	value: FormDataEntryValue | null
): TLocationFormValue | null => {
	if (typeof value !== 'string' || value.trim() === '') {
		return null;
	}

	try {
		const parsed = JSON.parse(value) as Record<string, unknown>;
		const lat = Number(parsed.lat);
		const lng = Number(parsed.lng);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return null;
		}

		const normalize = (input: unknown) =>
			typeof input === 'string' && input.trim() !== '' ? input : undefined;

		return {
			lat,
			lng,
			country: normalize(parsed.country),
			state: normalize(parsed.state),
			city: normalize(parsed.city),
			district: normalize(parsed.district),
			street: normalize(parsed.street),
			postcode: normalize(parsed.postcode),
			displayName: normalize(parsed.displayName)
		};
	} catch (_error) {
		return null;
	}
};

export const updateOrder = async (
	_prevState: TUpdateOrderSubmitState,
	formData: FormData
): Promise<TUpdateOrderSubmitState> => {
	const userSession = await getUserSession();
	if (userSession === null) {
		return { ok: false, message: 'default' };
	}

	const id = String(formData.get('orderId') || '').trim();
	const title = String(formData.get('title') || '').trim();
	const description = (formData.get('description') as string) || '';
	const productsJson = String(formData.get('products') || '[]');
	const locationPayload = parseLocation(formData.get('location'));

	if (!id || !title) {
		return { ok: false, message: 'invalidInput' };
	}

	let products: string[] = [];
	try {
		const parsed = JSON.parse(productsJson);
		if (Array.isArray(parsed)) products = parsed.map(String);
	} catch {}

	const res: TUpdateOrderResult = await (async () => {
		try {
			const updated = await prisma.order.updateMany({
				where: { id, userId: userSession.id },
				data: {
					title,
					description: description ? String(description) : null,
					amountOfProducts: products.length || null
				}
			});

			if (updated.count === 0) return { ok: false, code: 'ORDER_NOT_FOUND' };

			const foundProducts = await prisma.product.findMany({
				where: { orderId: id, userId: userSession.id },
				select: { id: true }
			});

			const { toDisconnect, toConnect, hasChanges } = findChangedProducts({
				foundProducts,
				newProductIds: products
			});

			if (hasChanges) {
				const updateOperations: Array<
					| ReturnType<typeof prisma.product.deleteMany>
					| ReturnType<typeof prisma.product.updateMany>
				> = [];
				if (toDisconnect.length) {
					updateOperations.push(
						prisma.product.deleteMany({
							where: { id: { in: toDisconnect }, userId: userSession.id }
						})
					);
				}
				if (toConnect.length) {
					updateOperations.push(
						prisma.product.updateMany({
							where: { id: { in: toConnect }, userId: userSession.id },
							data: { orderId: id }
						})
					);
				}
				if (updateOperations.length)
					await prisma.$transaction(updateOperations);
			}

			console.log('Location payload:', locationPayload);

			if (locationPayload) {
				await prisma.orderLocation.upsert({
					where: { orderId: id },
					update: {
						latitude: locationPayload.lat,
						longitude: locationPayload.lng,
						country: locationPayload.country ?? null,
						state: locationPayload.state ?? null,
						city: locationPayload.city ?? null,
						district: locationPayload.district ?? null,
						street: locationPayload.street ?? null,
						postcode: locationPayload.postcode ?? null,
						displayName: locationPayload.displayName ?? null
					},
					create: {
						orderId: id,
						userId: userSession.id,
						latitude: locationPayload.lat,
						longitude: locationPayload.lng,
						country: locationPayload.country ?? null,
						state: locationPayload.state ?? null,
						city: locationPayload.city ?? null,
						district: locationPayload.district ?? null,
						street: locationPayload.street ?? null,
						postcode: locationPayload.postcode ?? null,
						displayName: locationPayload.displayName ?? null
					}
				});
			}

			revalidateTag('orders');
			return { ok: true };
		} catch (_e) {
			return { ok: false, code: 'SERVER_ERROR' };
		}
	})();

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		ORDER_NOT_FOUND: 'default',
		SERVER_ERROR: 'default'
	};

	return {
		ok: false,
		message: res.ok
			? undefined
			: res.code
				? (codeToKey[res.code] ?? 'default')
				: undefined
	};
};
