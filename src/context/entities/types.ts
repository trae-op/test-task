import { type PropsWithChildren } from 'react';

export type TEntity = {
	[key: string]: any;
};

export type TProviderProps<T> = PropsWithChildren & {
	items: T[];
};

export type TContext<T> = {
	get: () => T[];
	remove: (id: string) => void;
	subscribe: (callback: () => void) => () => void;
};

export type TSubscriberCallback = () => void;
