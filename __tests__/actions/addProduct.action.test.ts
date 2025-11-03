import { addProduct } from '@/actions/addProduct/action';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: { create: jest.fn() },
		price: { createMany: jest.fn() }
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));
jest.mock('@/utils/generateSerialNumber', () => ({
	generateSerialNumber: () => 'SN-1'
}));
jest.mock('@/utils/isInt4', () => ({ isInt4: () => true }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('addProduct action', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns ok on valid input with session (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		mockPrisma.product.create.mockResolvedValue({ id: 'prod-1' });

		const res = await addProduct({ title: ' New Product ', prices: [] });

		expect(res).toEqual({ ok: true, id: 'prod-1' });
		expect(mockPrisma.product.create).toHaveBeenCalled();
	});

	it('returns UNAUTHORIZED when no session (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue(null);

		const res = await addProduct({ title: 'X', prices: [] });

		expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
		expect(mockPrisma.product.create).not.toHaveBeenCalled();
	});
});
