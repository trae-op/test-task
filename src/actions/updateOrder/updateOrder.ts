'use server';

import { revalidateTag } from 'next/cache';

import { findChangedProducts } from '@/utils/products';
import { getUserSession } from '@/utils/session';

import type { TUpdateOrderResult, TUpdateOrderSubmitState } from './types';
import { prisma } from '@/prisma/prisma-client';

export const updateOrder = async (
	_prevState: TUpdateOrderSubmitState,
	formData: FormData
): Promise<TUpdateOrderSubmitState> => {
	const id = String(formData.get('orderId') || '').trim();
	const title = String(formData.get('title') || '').trim();
	const description = (formData.get('description') as string) || '';
	const productsJson = String(formData.get('products') || '[]');

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
			const userSession = await getUserSession();
			if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };
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
					ReturnType<typeof prisma.product.updateMany>
				> = [];
				if (toDisconnect.length) {
					updateOperations.push(
						prisma.product.updateMany({
							where: { id: { in: toDisconnect }, userId: userSession.id },
							data: { orderId: null }
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
