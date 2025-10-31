'use server';

import { revalidateTag } from 'next/cache';

import { generateSerialNumber } from '@/utils/generateSerialNumber';
import { isInt4 } from '@/utils/isInt4';
import { getUserSession } from '@/utils/session';

import type { TAddProductInput, TAddProductResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export const addProduct = async (
	input: TAddProductInput
): Promise<TAddProductResult> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const title = String(input.title || '').trim();
		const serialNumber = generateSerialNumber();
		const type = input.type ? String(input.type).trim() : null;
		const specification = input.specification
			? String(input.specification).trim()
			: null;
		const guaranteeStart = input.guaranteeStart
			? new Date(input.guaranteeStart)
			: null;
		const guaranteeEnd = input.guaranteeEnd
			? new Date(input.guaranteeEnd)
			: null;

		const prices = Array.isArray(input.prices) ? input.prices : [];

		if (!title) return { ok: false, code: 'INVALID_INPUT' };

		if (guaranteeStart && Number.isNaN(guaranteeStart.getTime()))
			return { ok: false, code: 'INVALID_INPUT' };
		if (guaranteeEnd && Number.isNaN(guaranteeEnd.getTime()))
			return { ok: false, code: 'INVALID_INPUT' };
		if (guaranteeStart && guaranteeEnd && guaranteeStart > guaranteeEnd)
			return { ok: false, code: 'INVALID_INPUT' };

		if (prices.length) {
			for (const price of prices) {
				if (!isInt4(price.value)) {
					return { ok: false, code: 'INT4_OVERFLOW' };
				}
			}
		}

		const created = await prisma.product.create({
			data: {
				title,
				serialNumber,
				type,
				specification,
				guaranteeStart,
				guaranteeEnd,
				isNew: true,
				date: new Date(),
				userId: userSession.id
			}
		});

		if (prices.length) {
			const pricesToCreate = prices.map(price => ({
				symbol: price.symbol,
				userId: userSession.id,
				value: price.value || 0,
				isDefault: Boolean(price.isDefault),
				productId: created.id
			}));

			await prisma.price.createMany({
				data: pricesToCreate
			});
		}

		revalidateTag('products');

		return { ok: true, id: created.id };
	} catch (e) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
