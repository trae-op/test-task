import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import {
	addCurrency,
	deleteCurrency,
	getCurrencies
} from '@/app/_conceptions/Settings/actions/currency/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		currency: {
			create: jest.fn(),
			findFirst: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			delete: jest.fn()
		}
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

describe('Settings currency actions', () => {
	test('addCurrency returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await addCurrency({ title: 'USD', value: '$' });

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('addCurrency returns INVALID_INPUT for empty fields', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const result = await addCurrency({ title: '', value: '' });

		expect(result).toEqual({ ok: false, code: 'INVALID_INPUT' });
	});

	test('addCurrency creates and returns item', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const item = { id: 'c1', title: 'USD', value: '$', userId: 'user-1' };
		(prisma.currency.findFirst as jest.Mock).mockResolvedValueOnce(null);
		(prisma.currency.create as jest.Mock).mockResolvedValueOnce(item);

		const result = await addCurrency({ title: 'USD', value: '$' });

		expect(prisma.currency.create).toHaveBeenCalledWith({
			data: { title: 'USD', value: '$', userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, item });
		expect(revalidateTag).toHaveBeenCalledWith('products');
	});

	test('addCurrency returns SERVER_ERROR on thrown error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.currency.create as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await addCurrency({ title: 'USD', value: '$' });

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('getCurrencies returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await getCurrencies();

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('getCurrencies returns items', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const items = [{ id: 'c1' }];
		(prisma.currency.findMany as jest.Mock).mockResolvedValueOnce(items);

		const result = await getCurrencies();

		expect(prisma.currency.findMany).toHaveBeenCalledWith({
			where: { userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, items });
	});

	test('getCurrencies returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.currency.findMany as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await getCurrencies();

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('deleteCurrency returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', 'c1');

		const result = await deleteCurrency({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('deleteCurrency returns ID_NOT_FOUND when id missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const formData = new FormData();
		formData.set('id', '');

		const result = await deleteCurrency({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'ID_NOT_FOUND' });
	});

	test('deleteCurrency returns NOT_FOUND when entity missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.currency.findUnique as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', 'c1');

		const result = await deleteCurrency({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'NOT_FOUND' });
	});

	test('deleteCurrency deletes entity and revalidates', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.currency.findUnique as jest.Mock).mockResolvedValueOnce({
			id: 'c1'
		});

		const formData = new FormData();
		formData.set('id', 'c1');

		const result = await deleteCurrency({ ok: false }, formData);

		expect(prisma.currency.delete).toHaveBeenCalledWith({
			where: { id: 'c1' }
		});
		expect(result).toEqual({ ok: true });
		expect(revalidateTag).toHaveBeenCalledWith('products');
	});

	test('deleteCurrency returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.currency.findUnique as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const formData = new FormData();
		formData.set('id', 'c1');

		const result = await deleteCurrency({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
