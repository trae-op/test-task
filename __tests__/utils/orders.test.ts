import { calculateOrderTotals } from '@/utils/orders';

type Price = { symbol: string; value: number; isDefault?: boolean };
type Product = { prices?: Price[] };
type Order = { id: string; products?: Product[] };

describe('calculateOrderTotals', () => {
	it('aggregates product prices by currency with 3-decimal rounding', () => {
		const orders: Order[] = [
			{
				id: 'o1',
				products: [
					{ prices: [{ symbol: 'USD', value: 10.12345, isDefault: true }] },
					{
						prices: [
							{ symbol: 'USD', value: 5.55555 },
							{ symbol: 'EUR', value: 2.4 }
						]
					}
				]
			}
		];

		const res = calculateOrderTotals(orders as any);
		expect(res[0].prices).toEqual(
			expect.arrayContaining([
				{ symbol: 'USD', value: 15.679, isDefault: false },
				{ symbol: 'EUR', value: 2.4, isDefault: false }
			])
		);
	});

	it('returns prices undefined when no products', () => {
		const res = calculateOrderTotals([{ id: 'o2' }] as any);
		expect(res[0].prices).toBeUndefined();
	});
});
