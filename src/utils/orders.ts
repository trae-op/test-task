import type { TOrder } from '@/types/orders';

export function calculateOrderTotals(orders: TOrder[]) {
	return orders.map(order => {
		const currencyTotals = new Map<
			string,
			{ value: number; isDefault: boolean }
		>();

		for (const product of order.products ?? []) {
			for (const pr of product.prices ?? []) {
				const symbol = pr.symbol as string;
				const value = Number(pr.value ?? 0);
				currencyTotals.set(symbol, {
					value: Number(
						((currencyTotals.get(symbol)?.value ?? 0) + value).toFixed(3)
					),
					isDefault: pr.isDefault ?? false
				});
			}
		}
		const prices = Array.from(currencyTotals.entries()).map(
			([symbol, { value, isDefault }]) => ({
				value,
				symbol,
				isDefault
			})
		);

		return {
			...order,
			prices: prices.length ? prices : undefined
		};
	});
}
