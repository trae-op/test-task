import {
	createParams,
	getAddOrderHref,
	getAddProductHref,
	getApiUrl,
	getBaseUrl,
	getOrderDetailHref,
	getOrderUpdateHref,
	getProductUpdateHref,
	getWithoutLocalePath,
	parseQueryParams
} from '@/utils/routing';

describe('routing helpers', () => {
	test('createParams builds flat and nested fields', () => {
		const query = createParams({
			id: 1,
			fields: ['a', { b: ['c', 'd'] }],
			type: 'test'
		});
		expect(query).toBe('?id=1&type=test&fields=a,b&fieldsB=c,d');
	});

	test('parseQueryParams parses flat and nested fields', () => {
		const parsed = parseQueryParams('?fields=a,b&fieldsB=c,d');
		expect(parsed.a).toBe(true);
		const b = parsed.b as { select: Record<string, boolean> };
		expect(b.select.c).toBe(true);
		expect(b.select.d).toBe(true);
	});

	test('getWithoutLocalePath strips leading locale segment', () => {
		expect(getWithoutLocalePath('/en/orders')).toBe('/orders');
		expect(getWithoutLocalePath('/uk/orders')).toBe('/orders');
		expect(getWithoutLocalePath('/orders')).toBe('/orders');
	});

	test('href builders compose URLs', () => {
		expect(getAddOrderHref).toBe('/orders/new');
		expect(getAddProductHref).toBe('/products/new');
		expect(getOrderDetailHref(1)).toBe('/orders/1');
		expect(getOrderUpdateHref('id')).toBe('/orders/id/update');
		expect(getProductUpdateHref('id')).toBe('/products/id/update');
	});

	test('getBaseUrl and getApiUrl use environment when no window', () => {
		const base = getBaseUrl();
		const api = getApiUrl('/api/test');
		expect(base).toBe('http://localhost');
		expect(api).toBe('http://localhost/api/test');
	});
});
