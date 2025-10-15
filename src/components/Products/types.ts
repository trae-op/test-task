import type { TPrice, TProductData } from '@/types/product';

export type TProductProps = TProductData;

export type TProductsProps = {
	items: TProductData[];
	isDetail?: boolean;
};

export type TProductStateProps = {
	isNew: 0 | 1;
};

export type TProductPriceProps = {
	price: TPrice[];
};
