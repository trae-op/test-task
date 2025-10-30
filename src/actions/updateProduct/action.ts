'use server';

import { TPrice } from '@/types/price';
import { TProduct, TProductActionResult } from '@/types/products';

import { getUserSession } from '@/utils/session';

import type { TUpdateProductInput, TUpdateProductResult } from './types';
import { prisma } from '@/prisma/prisma-client';

const findExtraPrices = (
	existingPrices: TPrice[],
	sourcePrices: {
		symbol: 'USD' | 'UAH';
		userId: string;
		value: number;
		isDefault: boolean;
		productId: string;
	}[]
): {
	symbol: 'USD' | 'UAH';
	userId: string;
	value: number;
	isDefault: boolean;
	productId: string;
}[] => {
	const existingIds = new Set(existingPrices.map(price => price.value));

	const extraPrices = sourcePrices.filter(
		price => !existingIds.has(price.value)
	);

	return extraPrices;
};

export async function updateProduct(
	id: string,
	data: TUpdateProductInput
): Promise<TUpdateProductResult> {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const foundPrices = await prisma.price.findMany({
			where: {
				productId: id,
				userId: userSession.id
			}
		});

		const defaultPrices = data.prices || [];

		const pricesToCreate = defaultPrices.map(price => ({
			symbol: price.symbol,
			userId: userSession.id,
			value: price.value || 0,
			isDefault: Boolean(price.isDefault),
			productId: id
		}));

		const newPrices = findExtraPrices(foundPrices, pricesToCreate);

		if (newPrices.length) {
			await prisma.$transaction([
				prisma.price.deleteMany({
					where: {
						productId: id,
						userId: userSession.id
					}
				}),

				prisma.price.createMany({
					data: [...newPrices, ...pricesToCreate]
				})
			]);
		}

		const { prices, ...dataWithoutPrices } = data;

		const updated = await prisma.product.updateMany({
			where: {
				id,
				userId: userSession.id
			},
			data: dataWithoutPrices
		});

		if (updated.count === 0) {
			return { ok: false, code: 'ORDER_NOT_FOUND' };
		}

		return { ok: true };
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
