import { type PropsWithChildren } from 'react';

import type { TProductType } from '@/types/productType';

export type TEntity = TProductType;

export type TProviderProps = PropsWithChildren & {
	items?: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
	subscribe: (callback: () => void) => () => void;
	isLoading: () => boolean;
	setListLoading: (loadingState: boolean) => void;
	setDeleteLoading: (loadingState: boolean) => void;
	isDeleteLoading: () => boolean;
};

export type TSubscriberCallback = () => void;
