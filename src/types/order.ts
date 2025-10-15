import type { TPrice, TProductData } from './product';

export type TOrderData = {
	id: string;
	title: string;
	productCount: number;
	date: Date;
	description?: string;
	price: TPrice[];
	products: TProductData[];
};
