import { type PropsWithChildren } from 'react';

import { TProduct } from '@/types/products';

export type TEntity = TProduct;

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
