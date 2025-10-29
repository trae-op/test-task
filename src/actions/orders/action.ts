import { TOrder, TOrderActionResult } from '@/types/orders';

import { calculateOrderTotals } from '@/utils/orders';
import { getUserSession } from '@/utils/session';

import type { TOptions } from './types';
import { prisma } from '@/prisma/prisma-client';

export async function getOrders(
	options?: TOptions
): Promise<TOrderActionResult> {
	try {
		const { whereFilters, selectFields } = options || {};
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const entities = await prisma.order.findMany({
			...(selectFields !== undefined
				? {
						select: selectFields
					}
				: {}),
			where: {
				...(whereFilters !== undefined ? whereFilters : {}),
				userId: userSession.id
			}
		});

		return {
			ok: true,
			items: calculateOrderTotals(
				entities.map((item: TOrder) => ({
					...item,
					amountOfProducts: item.products ? item.products.length : 0
				}))
			)
		};
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}

export async function getOrderById(id: string) {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		if (!id) {
			return { code: 'MISSING_ID', ok: false };
		}

		const order = await prisma.order.findUnique({
			where: { id, userId: userSession.id },
			include: { products: { include: { prices: true } } }
		});

		if (!order) {
			return { code: 'ORDER_NOT_FOUND', ok: false };
		}

		const orders = await prisma.order.findMany({
			where: {
				userId: userSession.id
			}
		});

		return {
			title: order.title,
			orders: orders.map(({ title, amountOfProducts, date, id }) => ({
				id,
				title: title || undefined,
				date: date || undefined,
				amountOfProducts: amountOfProducts || undefined
			})),
			products: order.products.map(
				({ title, photo, serialNumber, id, isNew }) => ({
					title,
					photo: photo ?? 'https://placehold.co/600x400/000000/FFFFFF.png',
					serialNumber,
					id,
					isNew
				})
			)
		};
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
