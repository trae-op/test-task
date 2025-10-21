'use server';

import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { prisma } from '../../../prisma/prisma-client';

import type { TAddProductInput, TAddProductResult } from './types';
import { authOptions } from '@/app/api/auth/config';

const isValidUuid = (v?: string | null) => !v || /^[0-9a-fA-F-]{36}$/.test(v);

export const addProduct = async (
	input: TAddProductInput
): Promise<TAddProductResult> => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) return { ok: false, code: 'UNAUTHORIZED' };

		const title = String(input.title || '').trim();
		const serialNumber = String(input.serialNumber || '').trim();
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
		const isNew = Boolean(input.isNew === '1' || input.isNew === true);
		const prices = Array.isArray(input.prices) ? input.prices : [];

		if (!title || !serialNumber) return { ok: false, code: 'INVALID_INPUT' };
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
				isNew,
				date: new Date(),
				prices: {
					createMany: {
						data: prices.map(p => ({
							symbol: p.symbol,
							value: new Prisma.Decimal(p.value || 0),
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

		return { ok: true, id: created.id };
	} catch (_e) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
