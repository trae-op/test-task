import { buildOrderDynamicsSeries } from '@/utils/orderDynamics';

describe('buildOrderDynamicsSeries', () => {
	it('should build series when orders span multiple months', () => {
		const orders = [
			{
				date: '2024-01-10T00:00:00.000Z',
				amountOfProducts: 2,
				prices: [{ value: 100, symbol: 'USD', isDefault: true }]
			},
			{
				date: '2024-01-25T12:00:00.000Z',
				amountOfProducts: 1,
				prices: [{ value: 50, symbol: 'USD', isDefault: true }]
			},
			{
				date: '2024-03-05T00:00:00.000Z',
				amountOfProducts: 3,
				prices: [{ value: 20, symbol: 'EUR', isDefault: true }]
			}
		];

		const result = buildOrderDynamicsSeries({ orders, locale: 'en' });

		expect(result.labels).toEqual(['Jan 2024', 'Feb 2024', 'Mar 2024']);
		expect(result.orders).toEqual([2, 0, 1]);
		expect(result.products).toEqual([3, 0, 3]);
		expect(result.totalsByCurrency).toEqual({
			EUR: [0, 0, 20],
			USD: [150, 0, 0]
		});
	});

	it('should return empty series when all dates are missing', () => {
		const orders = [{ date: null }, { date: undefined }, { date: '' }];

		const result = buildOrderDynamicsSeries({ orders, locale: 'en' });

		expect(result.labels).toEqual([]);
		expect(result.orders).toEqual([]);
		expect(result.products).toEqual([]);
		expect(result.totalsByCurrency).toEqual({});
	});
});
