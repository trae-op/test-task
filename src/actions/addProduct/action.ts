'use server';

import { prisma } from '../../../prisma/prisma-client';

import type {
	TAddProductInput,
	TAddProductResult
} from '@/actions/addProduct/types';

export const addProduct = async (
	input: TAddProductInput
): Promise<TAddProductResult> => {
	try {
		const title = String(input.title || '').trim();
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

		if (!title) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		if (
			!guaranteeStart ||
			!guaranteeEnd ||
			isNaN(guaranteeStart.getTime()) ||
			isNaN(guaranteeEnd.getTime())
		) {
			return { ok: false, code: 'INVALID_INPUT' };
		}

		// Simple serial number generation; in a real app this might come from a sequence
		const serialNumber = `SN-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

		const currency = input.price?.symbol;
		const priceValue = input.price?.value;

		const created = await prisma.product.create({
			data: {
				serialNumber,
				title,
				type,
				specification,
				guaranteeStart: guaranteeStart ?? undefined,
				guaranteeEnd: guaranteeEnd ?? undefined,
				date: new Date(),
				prices:
					currency && priceValue !== undefined
						? {
								create: {
									symbol: currency,
									value: priceValue,
									isDefault: true
								}
							}
						: undefined,
				// Best-effort connect existing orders if any ids provided
				...(input.orders && input.orders.length > 0
					? {
							orders: {
								connect: input.orders.map((id: string) => ({ id }))
							}
						}
					: {})
			}
		});

		return { ok: true, productId: created.id };
	} catch (_e) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
