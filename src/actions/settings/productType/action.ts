'use server';

import { revalidateTag } from 'next/cache';

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

		const item = await prisma.productType.create({
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

export const getProductTypes = async () => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) return { ok: false, code: 'UNAUTHORIZED' };

		const items = await prisma.productType.findMany({
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

export const deleteProductType = async (
	_prevState: any,
	formData: FormData
) => {
	try {
		const userSession = await getUserSession();
		if (userSession === null) {
			return { ok: false, code: 'UNAUTHORIZED' };
		}
		const id = String(formData.get('id') || '');

		if (id === null) {
			return { ok: false, code: 'ID_NOT_FOUND' };
		}

		const entity = await prisma.productType.findUnique({ where: { id } });
		if (!entity) {
			return { ok: false, code: 'NOT_FOUND' };
		}

		await prisma.productType.delete({ where: { id } });

		revalidateTag('products');

		return {
			ok: true
		};
	} catch {
		return { ok: false, code: 'SERVER_ERROR' };
	}
};
