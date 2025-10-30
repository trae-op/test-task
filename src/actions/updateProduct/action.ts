import { TPrice } from '@/types/price';
import { TProduct, TProductActionResult } from '@/types/products';

import { getUserSession } from '@/utils/session';

import type { TUpdateProductInput, TUpdateProductResult } from './types';
import { prisma } from '@/prisma/prisma-client';

// Returns prices that user changed (value, symbol, isDefault)
const findChangedPrices = (
	foundDefaultPrices: TPrice[],
	transformNewPrices: {
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
	// If lengths differ, prices have changed
	if (foundDefaultPrices.length !== transformNewPrices.length) {
		return transformNewPrices;
	}

	// Compare each price by symbol, value, isDefault, userId, productId
	const allMatch = transformNewPrices.every(newPrice => {
		const found = foundDefaultPrices.find(
			p =>
				p.symbol === newPrice.symbol &&
				p.userId === newPrice.userId &&
				p.productId === newPrice.productId
		);
		return (
			found &&
			found.value === newPrice.value &&
			found.isDefault === newPrice.isDefault
		);
	});

	if (allMatch) {
		return [];
	}
	// Return all new prices if any difference
	return transformNewPrices;
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

		const newPrices = data.prices || [];

		const foundDefaultPrices = await prisma.price.findMany({
			where: {
				productId: id,
				userId: userSession.id
			}
		});

		const transformNewPrices = newPrices.map(price => ({
			symbol: price.symbol,
			userId: userSession.id,
			value: price.value || 0,
			isDefault: Boolean(price.isDefault),
			productId: id
		}));

		const changedPrices = findChangedPrices(
			foundDefaultPrices,
			transformNewPrices
		);

		console.log('>>> foundDefaultPrices:', foundDefaultPrices);
		console.log('>>> transformNewPrices:', transformNewPrices);
		// console.log('>>> changedPrices:', changedPrices);

		if (changedPrices.length) {
			await prisma.$transaction([
				prisma.price.deleteMany({
					where: {
						productId: id,
						userId: userSession.id
					}
				}),
				prisma.price.createMany({
					data: changedPrices
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
