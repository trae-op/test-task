import type { TOrder } from '@/types/orders';

export function calculateOrderTotals(orders: Partial<TOrder>[]) {
	return orders.map(order => {
		// Aggregate prices by currency across all products in the order
		const totals = new Map<string, { value: number; isDefault: boolean }>();

		for (const product of order.products ?? []) {
			for (const pr of product.prices ?? []) {
				const symbol = pr.symbol as string;
				const value = Number(pr.value ?? 0);
				totals.set(symbol, {
					value: Number(((totals.get(symbol)?.value ?? 0) + value).toFixed(3)),
					isDefault: pr.isDefault ?? false
				});
			}
		}
		//toFixed(3)
		const prices = Array.from(totals.entries()).map(
			([symbol, { value, isDefault }]) => ({
				value,
				symbol,
				isDefault
			})
		);

		return {
			...order,
			prices: prices.length ? prices : undefined,
			amountOfProducts: order.products?.length || 0
		};
	});
}
