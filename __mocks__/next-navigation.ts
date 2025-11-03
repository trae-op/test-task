export const useParams = <T extends Record<string, string>>() =>
	({}) as unknown as T;

export const usePathname = () => '/';
export const useRouter = () => ({
	push: jest.fn(),
	replace: jest.fn(),
	refresh: jest.fn()
});

export const useSearchParams = () => {
	const map = new Map<string, string>();
	return {
		get: (key: string) => map.get(key) ?? null,
		toString: () =>
			Array.from(map.entries())
				.map(([k, v]) => `${k}=${v}`)
				.join('&')
	} as URLSearchParams;
};
