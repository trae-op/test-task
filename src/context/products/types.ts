import { type PropsWithChildren } from 'react';

import { TProduct } from '@/types/products';

export type TEntity = TProduct;

export type TProviderProps = PropsWithChildren & {
	items: TEntity[];
};

export type TContext = {
	get: () => TEntity[];
	remove: (id: string) => void;
	subscribe: (callback: () => void) => () => void;
};

export type TSubscriberCallback = () => void;
