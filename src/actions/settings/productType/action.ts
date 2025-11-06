'use server';

import { getUserSession } from '@/utils/session';

import type { TAddProductTypeInput, TAddProductTypeResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export const addProductType = async (
	input: TAddProductTypeInput
): Promise<TAddProductTypeResult> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const title = String(input.title || '').trim();
		const value = String(input.value || '').trim();
		if (!title || !value) return { ok: false, code: 'INVALID_INPUT' };

		const created = await prisma.productType.create({ data: { title, value } });

		return {
			ok: true,
			item: { id: created.id, title: created.title, value: created.value }
		};
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
