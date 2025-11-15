import { revalidateTag } from 'next/cache';

import { getUserSession } from '@/utils/session';

import { addOrder } from '@/app/_conceptions/AddOrder/actions/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('next/cache', () => ({
	revalidateTag: jest.fn()
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: {
			findMany: jest.fn()
		},
		order: {
			create: jest.fn()
		}
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

describe('addOrder action', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('returns UNAUTHORIZED when user session missing', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await addOrder({
			title: 't',
			description: null,
			products: []
		});

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('returns PRODUCT_NOT_FOUND when product counts mismatch', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
			{ id: 'p1' }
		]);

		const result = await addOrder({
			title: 't',
			description: null,
			products: ['p1', 'p2']
		});

		expect(result).toEqual({ ok: false, code: 'PRODUCT_NOT_FOUND' });
		expect(prisma.order.create).not.toHaveBeenCalled();
	});

	test('creates order with products and revalidates tag', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
			{ id: 'p1' },
			{ id: 'p2' }
		]);
		(prisma.order.create as jest.Mock).mockResolvedValueOnce({ id: 'order-1' });

		const result = await addOrder({
			title: ' New order ',
			description: ' desc ',
			products: ['p1', 'p2']
		});

		expect(prisma.order.create).toHaveBeenCalledWith({
			data: expect.objectContaining({
				title: 'New order',
				description: 'desc',
				products: {
					connect: [{ id: 'p1' }, { id: 'p2' }]
				}
			})
		});
		expect(revalidateTag).toHaveBeenCalledWith('orders');
		expect(result).toEqual({ ok: true, id: 'order-1' });
	});

	test('creates order without products when list empty', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
		(prisma.order.create as jest.Mock).mockResolvedValueOnce({ id: 'order-2' });

		await addOrder({
			title: 'order',
			description: null,
			products: []
		});

		expect(prisma.order.create).toHaveBeenCalledWith({
			data: expect.not.objectContaining({ products: expect.anything() })
		});
	});

	test('returns SERVER_ERROR on thrown exception', async () => {
		(getUserSession as jest.Mock).mockRejectedValueOnce(new Error('fail'));

		const result = await addOrder({
			title: 'order',
			description: null,
			products: []
		});

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
