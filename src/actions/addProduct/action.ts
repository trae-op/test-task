'use server';

import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';

import { generateSerialNumber } from '@/utils/generateSerialNumber';
import { isValidUuid } from '@/utils/regExp';

import type { TAddProductInput, TAddProductResult } from './types';
import { authOptions } from '@/app/api/auth/config';
import { prisma } from '@/prisma/prisma-client';

export const addProduct = async (
	input: TAddProductInput
): Promise<TAddProductResult> => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) return { ok: false, code: 'UNAUTHORIZED' };

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
		const orderId = input.orderId ? String(input.orderId) : null;
		const prices = Array.isArray(input.prices) ? input.prices : [];

		if (!title) return { ok: false, code: 'INVALID_INPUT' };
		// Utility for serial number generation

		if (orderId && !isValidUuid(orderId))
			return { ok: false, code: 'INVALID_INPUT' };
		if (guaranteeStart && Number.isNaN(guaranteeStart.getTime()))
			return { ok: false, code: 'INVALID_INPUT' };
		if (guaranteeEnd && Number.isNaN(guaranteeEnd.getTime()))
			return { ok: false, code: 'INVALID_INPUT' };
		if (guaranteeStart && guaranteeEnd && guaranteeStart > guaranteeEnd)
			return { ok: false, code: 'INVALID_INPUT' };

		if (orderId) {
			const order = await prisma.order.findUnique({ where: { id: orderId } });
			if (!order) return { ok: false, code: 'ORDER_NOT_FOUND' };
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
				prices: {
					createMany: {
						data: prices.map(p => ({
							symbol: p.symbol,
							value: p.value || 0,
							isDefault: Boolean(p.isDefault)
						}))
					}
				},
				...(orderId
					? {
							orders: {
								connect: { id: orderId }
							}
						}
					: {})
			}
		});

		// Invalidate cached products queries
		revalidateTag('products');

		return { ok: true, id: created.id };
	} catch (e) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
