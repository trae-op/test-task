import { type TOrderDynamicsInput, type TOrderDynamicsSeries } from './types';

const buildMonthKey = (date: Date): string => {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
};

const normalizeToMonthStart = (date: Date): Date =>
	new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

type TMonthBucket = {
	orders: number;
	products: number;
	totals: Map<string, number>;
};

export const buildOrderDynamicsSeries = ({
	orders,
	locale
}: TOrderDynamicsInput): TOrderDynamicsSeries => {
	const buckets = new Map<string, TMonthBucket>();
	const currencySymbols = new Set<string>();
	let min: Date | null = null;
	let max: Date | null = null;

	for (const { date, amountOfProducts, prices } of orders) {
		if (!date) continue;
		const parsed = new Date(date);
		if (Number.isNaN(parsed.getTime())) continue;
		const normalized = normalizeToMonthStart(parsed);
		const key = buildMonthKey(normalized);
		if (!buckets.has(key)) {
			buckets.set(key, {
				orders: 0,
				products: 0,
				totals: new Map<string, number>()
			});
		}
		const bucket = buckets.get(key)!;
		bucket.orders += 1;
		bucket.products += Number(amountOfProducts ?? 0);

		for (const price of prices ?? []) {
			if (!price) continue;
			const symbol = price.symbol;
			if (!symbol) continue;
			const numericValue = Number(price.value ?? 0);
			if (Number.isNaN(numericValue)) continue;
			bucket.totals.set(
				symbol,
				(bucket.totals.get(symbol) ?? 0) + numericValue
			);
			currencySymbols.add(symbol);
		}

		if (min === null || normalized < min) {
			min = normalized;
		}
		if (max === null || normalized > max) {
			max = normalized;
		}
	}

	if (!min || !max) {
		return { labels: [], orders: [], products: [], totalsByCurrency: {} };
	}

	const labels: string[] = [];
	const ordersSeries: number[] = [];
	const productsSeries: number[] = [];
	const totalsByCurrency: Record<string, number[]> = {};
	const formatter = new Intl.DateTimeFormat(locale || 'en', {
		month: 'short',
		year: 'numeric'
	});
	const orderedSymbols = Array.from(currencySymbols).sort();
	for (const symbol of orderedSymbols) {
		totalsByCurrency[symbol] = [];
	}

	const cursor = new Date(min.getTime());
	while (cursor.getTime() <= max.getTime()) {
		const key = buildMonthKey(cursor);
		labels.push(formatter.format(cursor));
		const bucket = buckets.get(key);
		ordersSeries.push(bucket?.orders ?? 0);
		productsSeries.push(bucket?.products ?? 0);
		for (const symbol of orderedSymbols) {
			const totals = totalsByCurrency[symbol];
			totals.push(bucket?.totals.get(symbol) ?? 0);
		}
		cursor.setUTCMonth(cursor.getUTCMonth() + 1);
	}

	return {
		labels,
		orders: ordersSeries,
		products: productsSeries,
		totalsByCurrency
	};
};
