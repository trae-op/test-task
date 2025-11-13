'use server';

import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import type { TAddOrderInput, TAddOrderResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export const addOrder = async (
	input: TAddOrderInput
): Promise<TAddOrderResult> => {
	try {
		const userSession = await getUserSession();

		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const title = String(input.title || '').trim();
		const description = input.description
			? String(input.description).trim()
			: null;
		const products = Array.isArray(input.products) ? input.products : [];

		if (products.length > 0) {
			const found = await prisma.product.findMany({
				where: { id: { in: products } },
				select: { id: true }
			});
			if (found.length !== products.length)
				return { ok: false, code: 'PRODUCT_NOT_FOUND' };
		}

		const created = await prisma.order.create({
			data: {
				title,
				description,
				date: new Date(),
				userId: userSession.id,
				...(products.length
					? {
							products: {
								connect: products.map(id => ({ id }))
							}
						}
					: {})
			}
		});

		revalidateTag('orders');

		return { ok: true, id: created.id };
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
