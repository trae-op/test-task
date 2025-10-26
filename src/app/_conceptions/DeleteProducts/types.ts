import type { ComponentType } from 'react';

import { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TEntityTableProps<T> = {
	items: T[];
	isDetail: boolean;
	isDeleteButton: boolean;
};

export type TDeleteEntityProps<T> = {
	id: string;
	entityName: 'orders' | 'products';
	entityTableComponent?: ComponentType<TEntityTableProps<T>>;
};
