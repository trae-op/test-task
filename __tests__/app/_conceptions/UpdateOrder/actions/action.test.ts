import { revalidateTag } from 'next/cache';

import { findChangedProducts } from '@/utils/products';
import { getUserSession } from '@/utils/session';

import { updateOrder } from '@/app/_conceptions/UpdateOrder/actions/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		order: {
			updateMany: jest.fn()
		},
		product: {
			findMany: jest.fn(),
			updateMany: jest.fn()
		},
		orderLocation: {
			upsert: jest.fn()
		},
		$transaction: jest.fn(fn => fn())
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

jest.mock('@/utils/products', () => ({
	findChangedProducts: jest.fn(() => ({
		toDisconnect: [],
		toConnect: [],
		hasChanges: false
	}))
}));

describe('UpdateOrder updateOrder', () => {
	test('returns default message when no session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const formData = new FormData();
		formData.set('orderId', '1');
		formData.set('title', 'Order');

		const result = await updateOrder(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'default' });
	});

	test('returns invalidInput when id or title missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });

		const formData = new FormData();
		formData.set('orderId', '');
		formData.set('title', '');

		const result = await updateOrder(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'invalidInput' });
	});

	test('returns default when ORDER_NOT_FOUND', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.order.updateMany as jest.Mock).mockResolvedValueOnce({ count: 0 });

		const formData = new FormData();
		formData.set('orderId', '1');
		formData.set('title', 'Order');
		formData.set('products', '[]');

		const result = await updateOrder(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: 'default' });
	});

	test('successful path returns ok with undefined message', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		(prisma.order.updateMany as jest.Mock).mockResolvedValueOnce({ count: 1 });
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
		(findChangedProducts as jest.Mock).mockReturnValueOnce({
			toDisconnect: [],
			toConnect: [],
			hasChanges: false
		});

		const formData = new FormData();
		formData.set('orderId', '1');
		formData.set('title', 'Order');
		formData.set('products', '[]');

		const result = await updateOrder(
			{ ok: false, message: undefined },
			formData
		);

		expect(result).toEqual({ ok: false, message: undefined });
		expect(revalidateTag).toHaveBeenCalledWith('orders');
	});
});
