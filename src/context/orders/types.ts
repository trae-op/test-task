import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	setAll: (items: TEntity[]) => void;
	subscribe: (callback: () => void) => () => void;
};

export type TSubscriberCallback = () => void;
