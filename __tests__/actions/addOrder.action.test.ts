import { addOrder } from '@/actions/addOrder/action';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		order: { create: jest.fn() },
		product: { findMany: jest.fn() }
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('addOrder action', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('creates order with valid products (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const pid = '00000000-0000-0000-0000-000000000000';
		mockPrisma.product.findMany.mockResolvedValue([{ id: pid }]);
		mockPrisma.order.create.mockResolvedValue({ id: 'order-1' });

		const res = await addOrder({ title: 'Order', products: [pid] });
		expect(res).toEqual({ ok: true, id: 'order-1' });
		expect(mockPrisma.order.create).toHaveBeenCalled();
	});

	it('returns PRODUCT_NOT_FOUND when some products missing (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const pid = '00000000-0000-0000-0000-000000000000';
		mockPrisma.product.findMany.mockResolvedValue([]);

		const res = await addOrder({ title: 'Order', products: [pid] });
		expect(res).toEqual({ ok: false, code: 'PRODUCT_NOT_FOUND' });
		expect(mockPrisma.order.create).not.toHaveBeenCalled();
	});
});
