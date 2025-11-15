import { buildOrderDynamicsSeries } from '@/utils/orderDynamics/orderDynamics';

const makeOrder = (
	date: string,
	amountOfProducts: number,
	prices: { value: number; symbol: string }[]
) => ({
	date,
	amountOfProducts,
	prices
});

describe('buildOrderDynamicsSeries', () => {
	test('returns empty series when no valid dates', () => {
		const result = buildOrderDynamicsSeries({ orders: [], locale: 'en' });
		expect(result).toEqual({
			labels: [],
			orders: [],
			products: [],
			totalsByCurrency: {}
		});
	});

	test('aggregates orders per month and currency', () => {
		const orders = [
			makeOrder('2024-01-10T00:00:00Z', 2, [
				{ value: 10, symbol: 'USD' },
				{ value: 5, symbol: 'EUR' }
			]),
			makeOrder('2024-01-20T00:00:00Z', 1, [{ value: 3, symbol: 'USD' }]),
			makeOrder('2024-02-05T00:00:00Z', 4, [{ value: 7, symbol: 'USD' }])
		];
		const series = buildOrderDynamicsSeries({ orders, locale: 'en' });
		expect(series.labels.length).toBe(2);
		expect(series.orders).toEqual([2, 1]);
		expect(series.products).toEqual([3, 4]);
		expect(series.totalsByCurrency.USD).toEqual([13, 7]);
		expect(series.totalsByCurrency.EUR).toEqual([5, 0]);
	});
});
