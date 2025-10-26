import type { ComponentType } from 'react';

import { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TEntityTableProps = {
	items: TEntity[];
	isDetail: boolean;
	isDeleteButton: boolean;
};

export type TDeleteEntityProps = {
	id: string;
	entityTableComponent?: ComponentType<TEntityTableProps>;
};
