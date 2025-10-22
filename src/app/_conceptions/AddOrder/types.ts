import type { TProductData } from '@/types/product';

export type TAddOrderFormData = {
	title: string;
	description?: string;
	products: string[]; // product ids
};

export type TAddOrderProps = {
	products: TProductData[];
};
