import { getProducts } from '@/app/_conceptions/Products/actions/action';

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: { findMany: jest.fn() }
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('products actions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('getProducts returns items for authorized user (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const items = [{ id: 'p1', title: 'A' }];
		mockPrisma.product.findMany.mockResolvedValue(items);
		const res = await getProducts();
		expect(res).toEqual({ ok: true, items });
	});

	it('getProducts returns SERVER_ERROR on thrown error (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		mockPrisma.product.findMany.mockRejectedValue(new Error('db'));
		const res = await getProducts();
		expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
