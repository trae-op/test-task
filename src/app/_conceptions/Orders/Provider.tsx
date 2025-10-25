'use client';

import { TProviderProps } from './types';
import { Provider as OrdersProvider } from '@/context/entities';

export const Provider = ({ children, items }: TProviderProps) => {
	return <OrdersProvider items={items}>{children}</OrdersProvider>;
};
