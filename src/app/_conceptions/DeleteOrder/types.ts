import type { ComponentType } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

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
