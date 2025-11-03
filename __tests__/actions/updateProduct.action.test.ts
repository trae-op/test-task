import { updateProduct } from '@/actions/updateProduct/action';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));
jest.mock('@/utils/prices', () => ({
	findChangedPrices: () => ({ toDelete: [], toCreate: [], hasChanges: false })
}));

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: { updateMany: jest.fn() },
		price: {
			findMany: jest.fn(),
			deleteMany: jest.fn(),
			createMany: jest.fn()
		},
		$transaction: jest.fn()
	}
}));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));

const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('updateProduct action', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns ok-state mapping with undefined message on success (positive)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		mockPrisma.product.updateMany.mockResolvedValue({ count: 1 });
		mockPrisma.price.findMany.mockResolvedValue([]);

		const fd = new FormData();
		fd.set('id', 'prod-1');
		fd.set('title', 'New');
		fd.set('prices', '[]');

		const res = await updateProduct({ ok: false }, fd);
		expect(res).toEqual({ ok: false, message: undefined });
	});

	it('returns invalidInput when id/title missing (negative)', async () => {
		(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
		const fd = new FormData();
		fd.set('id', '');
		fd.set('title', '');
		const res = await updateProduct({ ok: false }, fd);
		expect(res).toEqual({ ok: false, message: 'invalidInput' });
		expect(mockPrisma.product.updateMany).not.toHaveBeenCalled();
	});
});
