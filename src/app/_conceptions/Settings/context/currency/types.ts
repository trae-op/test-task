import { type PropsWithChildren } from 'react';

import type { TCurrency } from '@/types/currency';

export type TEntity = TCurrency;

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
};

export type TSubscriberCallback = () => void;
