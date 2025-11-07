import { type PropsWithChildren } from 'react';

import { TOrder } from '@/types/orders';
import type { TProductType } from '@/types/productType';

export type TEntity = TOrder;

export type TProviderProps = PropsWithChildren & {
	avatarProfile?: string;
	productTypes?: TProductType[];
};

export type TContext = {
	getEntitiesTitle: () => string | undefined;
	getAvatarProfile: () => string | undefined;
	getEntitiesTotal: () => number | undefined;
	getProductTypes: () => TProductType[] | undefined;
	setAvatarProfile: (picture: string) => void;
	setEntitiesTitle: (title: string) => void;
	setEntitiesTotal: (total: number) => void;
	getLinkAddEntity: () => string | undefined;
	setLinkAddEntity: (link: string) => void;
	subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TSubscriberCallback = () => void;
