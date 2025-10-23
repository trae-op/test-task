import type { TProduct } from '@/types/products';

export type TProductProps = TProduct & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	isDetail?: boolean;
	orderTitle?: string;
};

export type TProductsProps = {
	items: TProduct[];
	isDetail?: boolean;
};

export type TProductStateProps = {
	isNew: true | false;
};
