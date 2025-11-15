import { revalidateTag } from 'next/cache';

import { convertToISOStringUTC } from '@/utils/dateTime';
import { isInt4 } from '@/utils/isInt4';
import { findChangedPrices } from '@/utils/prices';
import { getUserSession } from '@/utils/session';

import { updateProduct } from '@/app/_conceptions/UpdateProduct/actions/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: {
			updateMany: jest.fn()
		},
		price: {
			findMany: jest.fn(),
			deleteMany: jest.fn(),
			createMany: jest.fn()
		},
		$transaction: jest.fn(fn => fn)
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

jest.mock('@/utils/dateTime', () => ({
	convertToISOStringUTC: jest.fn(value => `iso-${value}`)
}));

jest.mock('@/utils/isInt4', () => ({
	isInt4: jest.fn(() => true)
}));

jest.mock('@/utils/prices', () => ({
	findChangedPrices: jest.fn(() => ({
		toDelete: [],
		toCreate: [],
		hasChanges: false
	}))
}));

describe('UpdateProduct updateProduct', () => {
	test('returns unauthorized message key when no session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('id', '1');
		formData.set('title', 'Test');

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'default' });
	});

	test('returns invalidInput when id or title missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });

		const formData = new FormData();
		formData.set('id', '');
		formData.set('title', '');

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'invalidInput' });
	});

	test('returns default message when ORDER_NOT_FOUND', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.product.updateMany as jest.Mock).mockResolvedValueOnce({
			count: 0
		});

		const formData = new FormData();
		formData.set('id', '1');
		formData.set('title', 'Title');
		formData.set('prices', '[]');

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'default' });
	});

	test('returns INT4_OVERFLOW when isInt4 fails', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.product.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
		(isInt4 as jest.Mock).mockReturnValueOnce(false);

		const formData = new FormData();
		formData.set('id', '1');
		formData.set('title', 'Title');
		formData.set(
			'prices',
			JSON.stringify([{ symbol: 'USD', value: 999999999, isDefault: true }])
		);

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'INT4_OVERFLOW' });
	});

	test('returns default on SERVER_ERROR from inner try', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.product.updateMany as jest.Mock).mockRejectedValueOnce(
			new Error('db')
		);

		const formData = new FormData();
		formData.set('id', '1');
		formData.set('title', 'Title');
		formData.set('prices', '[]');

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'default' });
	});

	test('successful path returns ok with undefined message', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.product.updateMany as jest.Mock).mockResolvedValueOnce({
			count: 1
		});
		(prisma.price.findMany as jest.Mock).mockResolvedValueOnce([]);
		(findChangedPrices as jest.Mock).mockReturnValueOnce({
			toDelete: [],
			toCreate: [],
			hasChanges: false
		});

		const formData = new FormData();
		formData.set('id', '1');
		formData.set('title', 'Title');
		formData.set('prices', '[]');

		const result = await updateProduct(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: undefined });
		expect(revalidateTag).toHaveBeenCalledWith('products');
	});
});
