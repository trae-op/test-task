'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import { convertToISOStringUTC } from '@/utils/dateTime';
import { findChangedPrices } from '@/utils/prices';
import { getUserSession } from '@/utils/session';

import type { TUpdateSubmitState } from './types';
import { prisma } from '@/prisma/prisma-client';

export const updateProduct = async (
	_prevState: TUpdateSubmitState,
	formData: FormData
): Promise<TUpdateSubmitState> => {
	const userSession = await getUserSession();
	if (userSession === null) {
		return { ok: false, message: 'default' };
	}

	const id = String(formData.get('id') || '').trim();
	const title = String(formData.get('title') || '').trim();
	const type = (formData.get('type') as string) || '';
	const specification = (formData.get('specification') as string) || '';
	const guaranteeStart = (formData.get('guaranteeStart') as string) || '';
	const guaranteeEnd = (formData.get('guaranteeEnd') as string) || '';
	const isNew = String(formData.get('isNew') || 'false') === 'true';

	const pricesJson = String(formData.get('prices') || '[]');

	if (!id || !title) {
		return { ok: false, message: 'invalidInput' };
	}

	let prices: Array<{ symbol: string; value: number; isDefault: boolean }> = [];
	try {
		const parsed = JSON.parse(pricesJson);
		if (Array.isArray(parsed)) {
			prices = parsed.map((p: Record<string, unknown>) => ({
				symbol: String(p.symbol),
				value: Number((p as Record<string, unknown>).value) || 0,
				isDefault: Boolean((p as Record<string, unknown>).isDefault)
			}));
		}
	} catch {}

	const res = await (async () => {
		try {
			const updated = await prisma.product.updateMany({
				where: { id, userId: userSession.id },
				data: {
					title,
					type,
					specification,
					guaranteeStart: guaranteeStart
						? convertToISOStringUTC(guaranteeStart)
						: null,
					guaranteeEnd: guaranteeEnd
						? convertToISOStringUTC(guaranteeEnd)
						: null,
					isNew,
					...(!isNew ? { orderId: null } : {})
				}
			});

			if (updated.count === 0)
				return { ok: false, code: 'ORDER_NOT_FOUND' as const };

			const foundPrices = await prisma.price.findMany({
				where: { productId: id, userId: userSession.id },
				select: { id: true, symbol: true, value: true, isDefault: true }
			});

			const { toDelete, toCreate, hasChanges } = findChangedPrices({
				foundPrices,
				newPrices: prices
			});

			if (hasChanges) {
				const updateOperations: Array<
					| ReturnType<typeof prisma.price.deleteMany>
					| ReturnType<typeof prisma.price.createMany>
				> = [];
				if (toDelete.length) {
					updateOperations.push(
						prisma.price.deleteMany({
							where: { id: { in: toDelete }, userId: userSession.id }
						})
					);
				}
				if (toCreate.length) {
					updateOperations.push(
						prisma.price.createMany({
							data: toCreate.map(p => ({
								symbol: p.symbol,
								value: Number(p.value) || 0,
								isDefault: Boolean(p.isDefault),
								productId: id,
								userId: userSession.id
							}))
						})
					);
				}
				if (updateOperations.length)
					await prisma.$transaction(updateOperations);
			}

			const locale = await getLocale();
			revalidatePath(`/${locale}/products`);
			return { ok: true } as const;
		} catch (_e) {
			return { ok: false, code: 'SERVER_ERROR' as const };
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
