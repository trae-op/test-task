import type { TProduct } from '@/types/products';

export type TAddOrderFormData = {
	title: string;
	description?: string;
	products: string[];
};

export type TAddOrderProps = {
	products: TProduct[];
};
