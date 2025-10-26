import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {
	items: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	subscribe: (callback: () => void) => () => void;
};

export type TSubscriberCallback = () => void;
