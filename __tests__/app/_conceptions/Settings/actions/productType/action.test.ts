import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import {
	addProductType,
	deleteProductType,
	getProductTypes
} from '@/app/_conceptions/Settings/actions/productType/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		productType: {
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

describe('Settings productType actions', () => {
	test('addProductType returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await addProductType({ title: 'Phone', value: 'phone' });

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('addProductType returns INVALID_INPUT for empty fields', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const result = await addProductType({ title: '', value: '' });

		expect(result).toEqual({ ok: false, code: 'INVALID_INPUT' });
	});

	test('addProductType creates and returns item', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const item = { id: 't1', title: 'Phone', value: 'phone', userId: 'user-1' };
		(prisma.productType.findFirst as jest.Mock).mockResolvedValueOnce(null);
		(prisma.productType.create as jest.Mock).mockResolvedValueOnce(item);

		const result = await addProductType({ title: 'Phone', value: 'phone' });

		expect(prisma.productType.create).toHaveBeenCalledWith({
			data: { title: 'Phone', value: 'phone', userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, item });
		expect(revalidateTag).toHaveBeenCalledWith('products');
	});

	test('addProductType returns SERVER_ERROR on thrown error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.productType.create as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await addProductType({ title: 'Phone', value: 'phone' });

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('getProductTypes returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await getProductTypes();

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('getProductTypes returns items', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const items = [{ id: 't1' }];
		(prisma.productType.findMany as jest.Mock).mockResolvedValueOnce(items);

		const result = await getProductTypes();

		expect(prisma.productType.findMany).toHaveBeenCalledWith({
			where: { userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, items });
	});

	test('getProductTypes returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.productType.findMany as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const result = await getProductTypes();

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});

	test('deleteProductType returns UNAUTHORIZED without session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', 't1');

		const result = await deleteProductType({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('deleteProductType returns ID_NOT_FOUND when id missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });

		const formData = new FormData();
		formData.set('id', '');

		const result = await deleteProductType({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'ID_NOT_FOUND' });
	});

	test('deleteProductType returns NOT_FOUND when entity missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.productType.findUnique as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', 't1');

		const result = await deleteProductType({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'NOT_FOUND' });
	});

	test('deleteProductType deletes entity and revalidates', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.productType.findUnique as jest.Mock).mockResolvedValueOnce({
			id: 't1'
		});

		const formData = new FormData();
		formData.set('id', 't1');

		const result = await deleteProductType({ ok: false }, formData);

		expect(prisma.productType.delete).toHaveBeenCalledWith({
			where: { id: 't1' }
		});
		expect(result).toEqual({ ok: true });
		expect(revalidateTag).toHaveBeenCalledWith('products');
	});

	test('deleteProductType returns SERVER_ERROR on error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.productType.findUnique as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const formData = new FormData();
		formData.set('id', 't1');

		const result = await deleteProductType({ ok: false }, formData);

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
