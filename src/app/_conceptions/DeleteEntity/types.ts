import type { ComponentType } from 'react';

export type TEntityTableProps = {
	items: [];
	isDetail: boolean;
	isDeleteButton: boolean;
};

export type TDeleteEntityProps = {
	id: string;
	entityName: 'orders' | 'products';
	entityTableComponent?: ComponentType<TEntityTableProps>;
};
