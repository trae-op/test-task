import {
	addProductType,
	deleteProductType,
	getProductTypes
} from '@/actions/settings/productType/action';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));
jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		productType: {
			create: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			delete: jest.fn()
		}
	}
}));

const { revalidateTag } = jest.requireMock('next/cache');
const { getUserSession } = jest.requireMock('@/utils/session');
const { prisma: mockPrisma } = jest.requireMock('@/prisma/prisma-client');

describe('settings product type actions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('addProductType', () => {
		it('should create product type with trimmed values when session exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.create.mockResolvedValue({
				id: 'type-1',
				title: 'Title',
				value: 'Value'
			});

			const res = await addProductType({ title: ' Title ', value: ' Value ' });

			expect(res).toEqual({
				ok: true,
				item: {
					id: 'type-1',
					title: 'Title',
					value: 'Value'
				}
			});
			expect(mockPrisma.productType.create).toHaveBeenCalledWith({
				data: { title: 'Title', value: 'Value', userId: 'user-1' }
			});
			expect(revalidateTag).toHaveBeenCalledWith('products');
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const res = await addProductType({
				title: 'New type',
				value: 'new-type'
			});

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.productType.create).not.toHaveBeenCalled();
		});

		it('should reject invalid input when values are empty', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });

			const res = await addProductType({ title: '   ', value: '' });

			expect(res).toEqual({ ok: false, code: 'INVALID_INPUT' });
			expect(mockPrisma.productType.create).not.toHaveBeenCalled();
		});

		it('should return server error when create fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.create.mockRejectedValue(new Error('failure'));

			const res = await addProductType({ title: 'New', value: 'new' });

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
			expect(revalidateTag).not.toHaveBeenCalled();
		});
	});

	describe('getProductTypes', () => {
		it('should return user product types when session exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			const items = [{ id: 'type-1', title: 'Title', value: 'Value' }];
			mockPrisma.productType.findMany.mockResolvedValue(items);

			const res = await getProductTypes();

			expect(res).toEqual({ ok: true, items });
			expect(mockPrisma.productType.findMany).toHaveBeenCalledWith({
				where: { userId: 'user-1' }
			});
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const res = await getProductTypes();

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.productType.findMany).not.toHaveBeenCalled();
		});

		it('should return server error when query fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.findMany.mockRejectedValue(new Error('failure'));

			const res = await getProductTypes();

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
		});
	});

	describe('deleteProductType', () => {
		it('should delete product type and revalidate when entity exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.findUnique.mockResolvedValue({ id: 'type-1' });
			mockPrisma.productType.delete.mockResolvedValue(undefined);

			const formData = new FormData();
			formData.set('id', 'type-1');

			const res = await deleteProductType(null, formData);

			expect(res).toEqual({ ok: true });
			expect(mockPrisma.productType.delete).toHaveBeenCalledWith({
				where: { id: 'type-1' }
			});
			expect(revalidateTag).toHaveBeenCalledWith('products');
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const formData = new FormData();
			formData.set('id', 'type-1');

			const res = await deleteProductType(null, formData);

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.productType.findUnique).not.toHaveBeenCalled();
		});

		it('should return not found when entity is absent', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.findUnique.mockResolvedValue(null);

			const formData = new FormData();
			formData.set('id', 'type-1');

			const res = await deleteProductType(null, formData);

			expect(res).toEqual({ ok: false, code: 'NOT_FOUND' });
			expect(mockPrisma.productType.delete).not.toHaveBeenCalled();
		});

		it('should return server error when delete fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.productType.findUnique.mockResolvedValue({ id: 'type-1' });
			mockPrisma.productType.delete.mockRejectedValue(new Error('failure'));

			const formData = new FormData();
			formData.set('id', 'type-1');

			const res = await deleteProductType(null, formData);

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
		});
	});
});
