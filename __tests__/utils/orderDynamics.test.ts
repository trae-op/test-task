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

	it('should ignore invalid price values and NaN', () => {
		const orders = [
			{
				date: '2024-04-01T00:00:00.000Z',
				amountOfProducts: 4,
				prices: [
					{ value: Number.NaN, symbol: 'USD' },
					{ value: 10, symbol: 'USD' },
					{ value: 5, symbol: 'EUR' }
				]
			}
		];
		const result = buildOrderDynamicsSeries({ orders, locale: 'en' });
		expect(result.labels).toEqual(['Apr 2024']);
		expect(result.orders).toEqual([1]);
		expect(result.products).toEqual([4]);
		expect(result.totalsByCurrency).toEqual({ EUR: [5], USD: [10] });
	});

	it('should fill gap months between first and last order', () => {
		const orders = [
			{
				date: '2024-05-15T00:00:00.000Z',
				amountOfProducts: 1,
				prices: [{ value: 3, symbol: 'USD' }]
			},
			{
				date: '2024-07-02T00:00:00.000Z',
				amountOfProducts: 2,
				prices: [{ value: 7, symbol: 'USD' }]
			}
		];
		const result = buildOrderDynamicsSeries({ orders, locale: 'en' });
		expect(result.labels).toEqual(['May 2024', 'Jun 2024', 'Jul 2024']);
		expect(result.orders).toEqual([1, 0, 1]);
		expect(result.products).toEqual([1, 0, 2]);
		expect(result.totalsByCurrency).toEqual({ USD: [3, 0, 7] });
	});

	it('should sort currency symbols alphabetically regardless of insertion order', () => {
		const orders = [
			{
				date: '2024-08-01T00:00:00.000Z',
				amountOfProducts: 1,
				prices: [
					{ value: 1, symbol: 'USD' },
					{ value: 2, symbol: 'JPY' },
					{ value: 3, symbol: 'EUR' }
				]
			}
		];
		const result = buildOrderDynamicsSeries({ orders, locale: 'en' });
		const keys = Object.keys(result.totalsByCurrency);
		expect(keys).toEqual([...keys].sort());
	});
});
