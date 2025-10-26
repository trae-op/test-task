import type { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TProductProps = TEntity & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	isDetail?: boolean;
	orderTitle?: string;
};

export type TProductsProps = Pick<
	TProductProps,
	'isDeleteButton' | 'isDetail'
> & {
	items?: TEntity[];
};

export type TProductStateProps = {
	isNew: boolean;
};
