import { getUserSession } from '@/utils/session';

import { prisma } from '@/prisma/prisma-client';

export async function getProducts() {
	try {
		const userSession = await getUserSession();

		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const products = await prisma.product.findMany({
			orderBy: { date: 'desc' },
			include: {
				prices: true
			}
		});

		// Serialize Decimal and Date fields to plain JS types so these objects
		// can be safely passed from Server Components to Client Components.
		return products.map(product => ({
			...product,
			prices: (product.prices ?? []).map(p => ({
				...p,
				// Prisma Decimal -> number (plain JS) to avoid passing class instances
				value: Number((p as any).value ?? 0)
			}))
		}));
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
