import type { TPrice } from './product';

export type TOrderData = {
	id: string;
	title?: string;
	date?: Date;
	description?: string;
	price?: TPrice[];
	products?: string[];
	isDeleteButton?: boolean;
};
