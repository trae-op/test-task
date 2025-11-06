import { deleteEntityById } from '@/services/settings/productType';

const getFetchMock = jest.fn();
jest.mock('@/utils/api', () => ({
	getFetch: (...args: any[]) => (getFetchMock as any)(...args)
}));

describe('services/settings/productType', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls getFetch with correct path and method', async () => {
		getFetchMock.mockResolvedValueOnce({ results: { ok: true } });
		const res = await deleteEntityById('xyz');
		expect(getFetchMock).toHaveBeenCalledWith('productType?id=xyz', {
			method: 'DELETE'
		});
		expect(res).toEqual({ results: { ok: true } });
	});
});
