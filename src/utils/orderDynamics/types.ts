export type TOrderDynamicsPrice = {
	value: number;
	symbol: string;
	isDefault?: boolean | null;
};

export type TOrderDynamicsOrder = {
	date?: string | null;
	amountOfProducts?: number | null;
	prices?: ReadonlyArray<TOrderDynamicsPrice> | null;
};

export type TOrderDynamicsInput = {
	orders: ReadonlyArray<TOrderDynamicsOrder>;
	locale: string;
};

export type TOrderDynamicsSeries = {
	labels: string[];
	orders: number[];
	products: number[];
	totalsByCurrency: Record<string, number[]>;
};
