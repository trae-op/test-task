import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {
	entityId?: string;
	items?: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
	setEntityId: (entityId: string) => void;
	amountEntities: () => number;
	subscribe: (callback: () => void) => () => void;
	isLoading: () => boolean;
	getEntityId: () => string | undefined;
	setDeleteLoading: (loadingState: boolean) => void;
	setListLoading: (loadingState: boolean) => void;
	isDeleteLoading: () => boolean;
	setEntityTitle: (title: string) => void;
	getEntityTitle: () => string;
};

export type TSubscriberCallback = () => void;
