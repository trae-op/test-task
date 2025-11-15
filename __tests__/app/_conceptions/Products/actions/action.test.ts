import { getUserSession } from '@/utils/session';

import { getProducts } from '@/app/_conceptions/Products/actions/action';
import { prisma } from '@/prisma/prisma-client';

jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		product: {
			findMany: jest.fn()
		}
	}
}));

jest.mock('@/utils/session', () => ({
	getUserSession: jest.fn()
}));

describe('Products actions getProducts', () => {
	test('returns UNAUTHORIZED when no session', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await getProducts();

		expect(result).toEqual({ ok: false, code: 'UNAUTHORIZED' });
	});

	test('returns items with default options', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const items = [{ id: 'p1' }, { id: 'p2' }];
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce(items);

		const result = await getProducts();

		expect(prisma.product.findMany).toHaveBeenCalledWith({
			where: { userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, items });
	});

	test('applies whereFilters and selectFields when provided', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		const items = [{ id: 'p1', title: 'A' }];
		(prisma.product.findMany as jest.Mock).mockResolvedValueOnce(items);

		const result = await getProducts({
			whereFilters: { isNew: true },
			selectFields: { id: true, title: true }
		});

		expect(prisma.product.findMany).toHaveBeenCalledWith({
			select: { id: true, title: true },
			where: { isNew: true, userId: 'user-1' }
		});
		expect(result).toEqual({ ok: true, items });
	});

	test('returns SERVER_ERROR on thrown error', async () => {
		(getUserSession as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
		(prisma.product.findMany as jest.Mock).mockRejectedValueOnce(
			new Error('fail')
		);

		const result = await getProducts();

		expect(result).toEqual({ ok: false, code: 'SERVER_ERROR' });
	});
});
