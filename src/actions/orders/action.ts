import { calculateOrderTotals } from '@/utils/orders';
import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export async function getOrders() {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const orders = await prisma.order.findMany({
			where: { userId: userSession.id },
			orderBy: { date: 'desc' },
			include: {
				products: {
					include: { prices: true }
				}
			}
		});

		return calculateOrderTotals(orders);
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

		const products = (order.products ?? []).map(product => ({
			...product,
			photo: product.photo ?? 'https://placehold.co/600x400/000000/FFFFFF.png'
		}));

		return { orderTitle: order.title, products };
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
