'use server';

import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import type {
	TAddCurrencyInput,
	TAddCurrencyResult,
	TDeleteCurrencyState
} from './types';
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

		const existingCurrency = await prisma.currency.findFirst({
			where: {
				userId: userSession.id,
				OR: [{ title }, { value }]
			}
		});

		if (existingCurrency) {
			return { ok: false, code: 'ALREADY_EXISTS' };
		}

		const item = await prisma.currency.create({
			data: { title, value, userId: userSession.id }
		});

		revalidateTag('products');

		return {
			ok: true,
			item
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

export const deleteCurrency = async (
	_prevState: TDeleteCurrencyState,
	formData: FormData
): Promise<TDeleteCurrencyState> => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}
		const id = String(formData.get('id') || '').trim();

		if (!id) {
			return { ok: false, code: 'ID_NOT_FOUND' };
		}

		const entity = await prisma.currency.findUnique({ where: { id } });
		if (!entity) {
			return { ok: false, code: 'NOT_FOUND' };
		}

		await prisma.currency.delete({ where: { id } });

		revalidateTag('products');

		return {
			ok: true
		};
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
