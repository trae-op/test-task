import type { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TProductProps = TEntity & {
	isDeleteButton?: boolean;
};

export type TProductsProps = Pick<TProductProps, 'isDeleteButton'> & {
	items?: TEntity[];
};

export type TProductStateProps = {
	isNew: boolean;
};

export type TDeleteEntityProps = {
	id: string;
};
