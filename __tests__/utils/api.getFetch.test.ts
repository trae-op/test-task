import { getFetch } from '@/utils/api';

jest.mock('@/utils/routing', () => ({
	getApiUrl: (p: string) => `HOST${p}`
}));

describe('getFetch', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch as any;
		jest.restoreAllMocks();
	});

	it('returns parsed JSON on success', async () => {
		const resp = {
			status: 200,
			text: () => Promise.resolve('{"ok":true}')
		} as any;
		global.fetch = jest.fn().mockResolvedValue(resp);

		const { results } = await getFetch<{ ok: boolean }>('items');
		expect(global.fetch).toHaveBeenCalledWith(
			'HOST/api/items',
			expect.any(Object)
		);
		expect(results).toEqual({ ok: true });
	});

	it('returns empty object when body is empty', async () => {
		const resp = { status: 200, text: () => Promise.resolve('') } as any;
		global.fetch = jest.fn().mockResolvedValue(resp);

		const { results } = await getFetch<Record<string, never>>('items');
		expect(results).toEqual({});
	});

	it('throws response on HTTP error', async () => {
		const resp = {
			status: 404,
			text: () => Promise.resolve('not found')
		} as any;
		global.fetch = jest.fn().mockResolvedValue(resp);

		await expect(getFetch<any>('items')).rejects.toBe(resp);
	});

	it('uses full path when isFullPath is true', async () => {
		const url = 'https://example.com/api/custom';
		const resp = { status: 200, text: () => Promise.resolve('{"n":1}') } as any;
		global.fetch = jest.fn().mockResolvedValue(resp);

		const { results } = await getFetch<{ n: number }>(url, {
			isFullPath: true
		});
		expect(global.fetch).toHaveBeenCalledWith(url, expect.any(Object));
		expect(results).toEqual({ n: 1 });
	});
});
