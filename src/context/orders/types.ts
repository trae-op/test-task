import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {
	isAdaptiveTable?: boolean;
	entityId?: string;
	items?: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
	getEntityId: () => string | undefined;
	amountEntities: () => number;
	subscribe: (callback: () => void) => () => void;
	isLoading: () => boolean;
	hasAdaptiveTable: () => boolean;
	setDeleteLoading: (loadingState: boolean) => void;
	setAdaptiveTable: (adaptiveTableState: boolean) => void;
	setListLoading: (loadingState: boolean) => void;
	isDeleteLoading: () => boolean;
};

export type TSubscriberCallback = () => void;
