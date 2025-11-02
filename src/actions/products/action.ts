import { TProduct, TProductActionResult } from '@/types/products';

import { getUserSession } from '@/utils/session';

import type { TOptions } from './types';
import { prisma } from '@/prisma/prisma-client';

export async function getProducts(
	options?: TOptions
): Promise<TProductActionResult> {
	try {
		const { whereFilters, selectFields } = options || {};
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}

		const items = (await prisma.product.findMany({
			...(selectFields !== undefined
				? {
						select: selectFields
					}
				: {}),
			where: {
				...(whereFilters !== undefined ? whereFilters : {}),
				userId: userSession.id
			}
		})) as TProduct[];

		return {
			ok: true,
			items
		};
	} catch (_error) {
		return { ok: false, code: 'SERVER_ERROR' };
	}
}
