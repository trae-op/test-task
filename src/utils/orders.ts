import type { TOrder } from '@/types/orders';
import { TPrice } from '@/types/price';

export function calculateOrderTotals(orders: TOrder[]) {
	let result: {
		[key: string]: TPrice[];
	} = {};
	orders.forEach(order => {
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
				isDefault,
				id: order.id ?? '',
				userId: order.userId ?? '',
				productId: order.products?.[0]?.id ?? ''
			})
		);

		result[order.id ?? ''] = prices;
	});

	return result;
}
