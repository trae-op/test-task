import {
	addCurrency,
	deleteCurrency,
	getCurrencies
} from '@/actions/settings/currency/action';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));
jest.mock('@/utils/session', () => ({ getUserSession: jest.fn() }));
jest.mock('@/prisma/prisma-client', () => ({
	prisma: {
		currency: {
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

describe('settings currency actions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('addCurrency', () => {
		it('should create currency with trimmed values when session exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.create.mockResolvedValue({
				id: 'currency-1',
				title: 'Title',
				value: 'Value'
			});

			const res = await addCurrency({ title: ' Title ', value: ' Value ' });

			expect(res).toEqual({
				ok: true,
				item: {
					id: 'currency-1',
					title: 'Title',
					value: 'Value'
				}
			});
			expect(mockPrisma.currency.create).toHaveBeenCalledWith({
				data: { title: 'Title', value: 'Value', userId: 'user-1' }
			});
			expect(revalidateTag).toHaveBeenCalledWith('products');
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const res = await addCurrency({ title: 'USD', value: 'usd' });

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.currency.create).not.toHaveBeenCalled();
		});

		it('should reject invalid input when values are empty', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });

			const res = await addCurrency({ title: '   ', value: '' });

			expect(res).toEqual({ ok: false, code: 'INVALID_INPUT' });
			expect(mockPrisma.currency.create).not.toHaveBeenCalled();
		});

		it('should return server error when create fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.create.mockRejectedValue(new Error('failure'));

			const res = await addCurrency({ title: 'USD', value: 'usd' });

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
			expect(revalidateTag).not.toHaveBeenCalled();
		});
	});

	describe('getCurrencies', () => {
		it('should return user currencies when session exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			const items = [{ id: 'currency-1', title: 'USD', value: 'usd' }];
			mockPrisma.currency.findMany.mockResolvedValue(items);

			const res = await getCurrencies();

			expect(res).toEqual({ ok: true, items });
			expect(mockPrisma.currency.findMany).toHaveBeenCalledWith({
				where: { userId: 'user-1' }
			});
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const res = await getCurrencies();

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.currency.findMany).not.toHaveBeenCalled();
		});

		it('should return server error when query fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.findMany.mockRejectedValue(new Error('failure'));

			const res = await getCurrencies();

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
		});
	});

	describe('deleteCurrency', () => {
		it('should delete currency and revalidate when entity exists', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.findUnique.mockResolvedValue({ id: 'currency-1' });
			mockPrisma.currency.delete.mockResolvedValue(undefined);

			const formData = new FormData();
			formData.set('id', 'currency-1');

			const res = await deleteCurrency(null, formData);

			expect(res).toEqual({ ok: true });
			expect(mockPrisma.currency.delete).toHaveBeenCalledWith({
				where: { id: 'currency-1' }
			});
			expect(revalidateTag).toHaveBeenCalledWith('products');
		});

		it('should return unauthorized when session is missing', async () => {
			(getUserSession as jest.Mock).mockResolvedValue(null);

			const formData = new FormData();
			formData.set('id', 'currency-1');

			const res = await deleteCurrency(null, formData);

			expect(res).toEqual({ ok: false, code: 'UNAUTHORIZED' });
			expect(mockPrisma.currency.findUnique).not.toHaveBeenCalled();
		});

		it('should return not found when entity is absent', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.findUnique.mockResolvedValue(null);

			const formData = new FormData();
			formData.set('id', 'currency-1');

			const res = await deleteCurrency(null, formData);

			expect(res).toEqual({ ok: false, code: 'NOT_FOUND' });
			expect(mockPrisma.currency.delete).not.toHaveBeenCalled();
		});

		it('should return server error when delete fails', async () => {
			(getUserSession as jest.Mock).mockResolvedValue({ id: 'user-1' });
			mockPrisma.currency.findUnique.mockResolvedValue({ id: 'currency-1' });
			mockPrisma.currency.delete.mockRejectedValue(new Error('failure'));

			const formData = new FormData();
			formData.set('id', 'currency-1');

			const res = await deleteCurrency(null, formData);

			expect(res).toEqual({ ok: false, code: 'SERVER_ERROR' });
		});
	});
});
