import { calculateOrderTotals, getOrderNumberGeneration } from '@/utils/orders';

const makeOrder = (id: string, userId: string) => ({
	id,
	userId,
	products: [
		{
			id: 'p1',
			prices: [
				{ value: 1.1111, symbol: 'USD', isDefault: true },
				{ value: 2, symbol: 'EUR', isDefault: false }
			]
		},
		{
			id: 'p2',
			prices: [{ value: 3.2222, symbol: 'USD', isDefault: false }]
		}
	]
});

describe('calculateOrderTotals', () => {
	test('aggregates totals per currency per order', () => {
		const orders = [makeOrder('o1', 'u1')];
		const result = calculateOrderTotals(orders as any);
		const prices = result['o1'];
		expect(prices).toHaveLength(2);
		const usd = prices.find(p => p.symbol === 'USD');
		const eur = prices.find(p => p.symbol === 'EUR');
		expect(usd?.value).toBeCloseTo(4.333, 3);
		expect(eur?.value).toBe(2);
	});
});

describe('getOrderNumberGeneration', () => {
	test('returns value in #12345 format', () => {
		const value = getOrderNumberGeneration();
		expect(value).toMatch(/^#\d{5}$/);
	});

	test('generates different values over multiple calls', () => {
		const values = new Set<string>();
		for (let i = 0; i < 20; i += 1) {
			values.add(getOrderNumberGeneration());
		}
		expect(values.size).toBeGreaterThan(1);
	});
});
