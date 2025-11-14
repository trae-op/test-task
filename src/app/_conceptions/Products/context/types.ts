import { type PropsWithChildren } from 'react';

import { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TProviderProps = PropsWithChildren & {
	isAdaptiveTable?: boolean;
	items?: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
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
