import type { ComponentType } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TEntityTableProps = {
	items: TEntity[];
	isDetail: boolean;
	isDeleteButton: boolean;
};

export type TDeleteEntityProps = {
	id: string;
	entityTableComponent?: ComponentType<TEntityTableProps>;
};
