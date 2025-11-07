'use client';

import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import type { TEntity } from './types';

export const useEntityContext = () => {
	const ctx = useContext(Context);
	if (!ctx)
		throw new Error('Currency useEntityContext must be used within a Provider');
	return ctx;
};

export function useListSelector(): TEntity[] {
	const { get, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, get, get);
}

export function useListLoadingSelector(): boolean {
	const { isLoading, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, isLoading, isLoading);
}

export const useSetAllDispatch = () => useEntityContext().setAll;
export const useSetListLoadingDispatch = () =>
	useEntityContext().setListLoading;

export const useRemoveDispatch = () => useEntityContext().remove;
