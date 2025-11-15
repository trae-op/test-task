import { getFetch } from '@/utils/api/api';

jest.mock('@/utils/routing', () => ({
	getApiUrl: (path: string) => `https://example.com${path}`
}));

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
	jest.resetAllMocks();
});

describe('getFetch', () => {
	test('performs request to derived API URL and parses JSON', async () => {
		const mockResponse = { ok: true };
		global.fetch = jest.fn().mockResolvedValue({
			status: 200,
			text: () => Promise.resolve(JSON.stringify(mockResponse))
		}) as unknown as typeof fetch;
		const { results } = await getFetch<{ ok: boolean }>('test');
		expect(global.fetch).toHaveBeenCalledWith(
			'https://example.com/api/test',
			expect.objectContaining({ headers: expect.any(Object) })
		);
		expect(results).toEqual(mockResponse);
	});

	test('throws on HTTP error status', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			status: 404,
			text: () => Promise.resolve('Not found')
		}) as unknown as typeof fetch;
		await expect(getFetch('test')).rejects.toBeDefined();
	});
});
