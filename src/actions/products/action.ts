import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export async function getProducts() {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const products = await prisma.product.findMany({
			where: { userId: userSession.id },
			orderBy: { date: 'desc' },
			include: {
				prices: true
			}
		});

		return products;
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
