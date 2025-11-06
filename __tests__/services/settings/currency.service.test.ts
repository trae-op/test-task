import { deleteEntityById } from '@/services/settings/currency';

const getFetchMock = jest.fn();
jest.mock('@/utils/api', () => ({
	getFetch: (...args: any[]) => (getFetchMock as any)(...args)
}));

describe('services/settings/currency', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls getFetch with correct path and method', async () => {
		getFetchMock.mockResolvedValueOnce({ results: { ok: true } });
		const res = await deleteEntityById('abc');
		expect(getFetchMock).toHaveBeenCalledWith('currency?id=abc', {
			method: 'DELETE'
		});
		expect(res).toEqual({ results: { ok: true } });
	});
});
