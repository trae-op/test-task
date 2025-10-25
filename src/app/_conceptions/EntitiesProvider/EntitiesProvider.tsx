'use client';

import { TProviderProps } from './types';
import { Provider as EntityProvider } from '@/context/entities';
import { TEntity } from '@/context/entities/types';

export function EntitiesProvider<T extends TEntity>({
	children,
	items
}: TProviderProps<T>) {
	return <EntityProvider items={items}>{children}</EntityProvider>;
}
