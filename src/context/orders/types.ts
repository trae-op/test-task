import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
	amountEntities: () => number;
	subscribe: (callback: () => void) => () => void;
	isLoading: () => boolean;
	setDeleteLoading: (loadingState: boolean) => void;
	setListLoading: (loadingState: boolean) => void;
	isDeleteLoading: () => boolean;
};

export type TSubscriberCallback = () => void;
