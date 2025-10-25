import { ReactNode } from 'react';

import type { TOrder } from '@/types/orders';
import type { TPrice } from '@/types/price';

export type TOrderProps = TOrder & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	prices?: TPrice[];
};

export type TOrdersProps = {
	isDetail?: boolean;
	activeId?: string;
	isDeleteButton?: boolean;
	items?: TOrder[];
};

export type TProviderProps = Pick<TOrdersProps, 'items'> & {
	children: ReactNode;
};
