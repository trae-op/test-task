import { ReactNode } from 'react';

import type { TProduct } from '@/types/products';

export type TProductProps = TProduct & {
	isDeleteButton?: boolean;
	isActive?: boolean;
	isDetail?: boolean;
	orderTitle?: string;
};

export type TProductsProps = {
	isDetail?: boolean;
	isDeleteButton?: boolean;
	items?: TProduct[];
};

export type TProductStateProps = {
	isNew: true | false;
};

export type TProviderProps = Pick<TProductsProps, 'items'> & {
	children: ReactNode;
};
