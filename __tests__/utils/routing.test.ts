import { getOrderDetailHref } from '@/utils/routing';

describe('utils/routing', () => {
	it('builds order detail href for string id', () => {
		expect(getOrderDetailHref('abc')).toBe('/orders/abc');
	});

	it('builds order detail href for numeric id', () => {
		expect(getOrderDetailHref(42)).toBe('/orders/42');
	});
});
