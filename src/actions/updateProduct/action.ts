import { TPrice } from '@/types/price';

import { findChangedPrices } from '@/utils/prices';
import { getUserSession } from '@/utils/session';

import type { TPriceOption, TUpdateInput, TUpdateResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export async function updateProduct(
	id: string,
	data: TUpdateInput
): Promise<TUpdateResult> {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const newPrices = data.prices || [];

		const foundDefaultPrices = await prisma.price.findMany({
			where: {
				productId: id,
				userId: userSession.id
			}
		});

		const transformNewPrices: TPriceOption[] = newPrices.map(price => ({
			symbol: price.symbol,
			userId: userSession.id,
			productId: id,
			value: Number(price.value) || 0,
			isDefault: price.isDefault
		}));

		const changedPrices = findChangedPrices<TPrice, TPriceOption>({
			foundDefaultPrices,
			transformNewPrices,
			userId: userSession.id,
			productId: id
		});

		if (changedPrices.length) {
			await prisma.$transaction([
				prisma.price.deleteMany({
					where: {
						productId: id,
						userId: userSession.id
					}
				}),
				prisma.price.createMany({
					data: changedPrices.map(price => ({
						...price,
						productId: id,
						userId: userSession.id
					}))
				})
			]);
		}

		const { prices, ...dataWithoutPrices } = data;
		const { guaranteeStart, guaranteeEnd, title, type, specification, isNew } =
			dataWithoutPrices;

		const updated = await prisma.product.updateMany({
			where: {
				id,
				userId: userSession.id
			},
			data: {
				title,
				type,
				specification,
				guaranteeStart,
				guaranteeEnd,
				isNew
			}
		});

		if (updated.count === 0) {
			return { ok: false, code: 'ORDER_NOT_FOUND' };
		}

		return { ok: true };
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
