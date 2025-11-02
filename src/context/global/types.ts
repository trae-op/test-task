import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {
	avatarProfile?: string;
};

export type TContext = {
	getEntitiesTitle: () => string | undefined;
	getAvatarProfile: () => string | undefined;
	getEntitiesTotal: () => number | undefined;
	setAvatarProfile: (picture: string) => void;
	setEntitiesTitle: (title: string) => void;
	setEntitiesTotal: (total: number) => void;
	getLinkAddEntity: () => string | undefined;
	setLinkAddEntity: (link: string) => void;
	subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TSubscriberCallback = () => void;
