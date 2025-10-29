import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {};

export type TContext = {
	getEntitiesTitle: () => string | undefined;
	getEntitiesTotal: () => number | undefined;
	setEntitiesTitle: (title: string) => void;
	setEntitiesTotal: (total: number) => void;
	getLinkAddEntity: () => string | undefined;
	setLinkAddEntity: (link: string) => void;
	subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TSubscriberCallback = () => void;
