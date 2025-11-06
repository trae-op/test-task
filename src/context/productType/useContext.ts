'use client';

import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import type { TEntity } from './types';

export const useEntityContext = () => {
	const ctx = useContext(Context);
	if (!ctx)
		throw new Error(
			'ProductType useEntityContext must be used within a Provider'
		);
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

export function useDeleteLoadingSelector(): boolean {
	const { isDeleteLoading, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, isDeleteLoading, isDeleteLoading);
}

export const useSetAllDispatch = () => useEntityContext().setAll;
export const useSetListLoadingDispatch = () =>
	useEntityContext().setListLoading;
export const useSetDeleteLoadingDispatch = () =>
	useEntityContext().setDeleteLoading;
export const useRemoveDispatch = () => useEntityContext().remove;
