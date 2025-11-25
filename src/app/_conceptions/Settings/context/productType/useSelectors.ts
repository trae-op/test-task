'use client';

import { useSyncExternalStore } from 'react';

import type { TEntity } from './types';
import { useEntityContext } from './useContext';

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
