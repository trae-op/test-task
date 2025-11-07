'use server';

import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import type { TAddCurrencyInput, TAddCurrencyResult } from './types';
import { prisma } from '@/prisma/prisma-client';

export const addCurrency = async (
	input: TAddCurrencyInput
): Promise<TAddCurrencyResult> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const title = String(input.title || '').trim();
		const value = String(input.value || '').trim();
		if (!title || !value) return { ok: false, code: 'INVALID_INPUT' };

		const created = await prisma.currency.create({
			data: { title, value, userId: userSession.id }
		});

		revalidateTag('products');

		return {
			ok: true,
			item: { id: created.id, title: created.title, value: created.value }
		};
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};

export const getCurrencies = async () => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const items = await prisma.currency.findMany({
			where: { userId: userSession.id }
		});

		return {
			ok: true,
			items
		};
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
