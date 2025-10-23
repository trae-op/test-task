import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export async function getOrders() {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const orders = await prisma.order.findMany({
			orderBy: { date: 'desc' },
			include: {
				products: {
					include: { prices: true }
				}
			}
		});

		return orders.map(order => {
			// Aggregate prices by currency across all products in the order
			const totals = new Map<string, { value: number; isDefault: boolean }>();

			for (const product of order.products ?? []) {
				for (const pr of product.prices ?? []) {
					const symbol = pr.symbol as string;
					const value = Number(pr.value ?? 0);
					totals.set(symbol, {
						value: Number((((totals.get(symbol)?.value ?? 0) + value).toFixed(3))),
						isDefault: pr.isDefault ?? false
					});
				}
			}
			//toFixed(3)
			const prices = Array.from(totals.entries()).map(
				([symbol, { value, isDefault }]) => ({
					value,
					symbol,
					isDefault
				})
			);

			return {
				...order,
				prices: prices.length ? prices : undefined,
				amountOfProducts: order.products?.length || 0
			};
		});
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
			where: { id },
			include: { products: { include: { prices: true } } }
		});

		if (!order) {
			return { code: 'ORDER_NOT_FOUND', ok: false };
		}

		const products = (order.products ?? []).map(product => ({
			...product,
			photo: product.photo ?? 'https://placehold.co/600x400/000000/FFFFFF.png'
		}));

		return { orderTitle: order.title, products };
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
