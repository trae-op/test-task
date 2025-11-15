import { type PropsWithChildren } from 'react';

import type { TPickupLocation } from '@/types/pickupLocation';

export type TEntity = TPickupLocation;

export type TProviderProps = PropsWithChildren & {
	items?: TEntity[];
};

export type TSubscriberCallback = () => void;

export type TContext = {
	get: () => TEntity[];
	setAll: (items: TEntity[]) => void;
	setListLoading: (value: boolean) => void;
	subscribe: (callback: TSubscriberCallback) => () => void;
	isLoading: () => boolean;
};
