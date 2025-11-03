import { getOrderById, getOrders } from '@/actions/orders/action';

jest.mock('@/utils/orders', () => ({
	calculateOrderTotals: (x: unknown) => x
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		order: {
			findMany: jest.fn(),
			findUnique: jest.fn()
		}
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('orders actions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('getOrders returns items for authorized user (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const items = [{ id: 'o1', title: 'T', products: [] }];
		mockPrisma.order.findMany.mockResolvedValue(items);

		const res = await getOrders();
		expect(res).toEqual({
			ok: true,
			items: [
				{
					id: 'o1',
					title: 'T',
					products: [],
					amountOfProducts: 0
				}
			]
		});
	});

	it('getOrders returns UNAUTHORIZED when no session (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue(null);
		const res = await getOrders();
		expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	it('getOrderById returns shaped data (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		mockPrisma.order.findUnique.mockResolvedValue({
			id: 'o1',
			title: 'Order 1',
			products: [
				{ id: 'p1', title: 'A', photo: null, serialNumber: 'SN', isNew: true }
			]
		});
		mockPrisma.order.findMany.mockResolvedValue([
			{ id: 'o1', title: 'Order 1', amountOfProducts: 1, date: new Date() }
		]);

		const res = await getOrderById('o1');
		expect(res).toHaveProperty('title', 'Order 1');
		expect(res).toHaveProperty('orders');
		expect(res).toHaveProperty('products');
	});

	it('getOrderById returns MISSING_ID when id absent (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const res = await getOrderById('');
		expect(res).toEqual({ ok: false, code: 'MISSING_ID' });
	});
});
