import { ReactNode } from 'react';

import type { TOrder } from '@/types/orders';
import type { TPrice } from '@/types/price';

export type TEntity = TOrder;

export type TOrderProps = TEntity & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	prices?: TPrice[];
};

export type TOrdersProps = Pick<TOrderProps, 'isDeleteButton'> & {
	isDetail?: boolean;
	activeId?: string;
	items?: TEntity[];
};
