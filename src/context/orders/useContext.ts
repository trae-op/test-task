'use client';

import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import { TEntity } from './types';

export const useEntityContext = () => {
	const entityContext = useContext(Context);

	if (!entityContext)
		throw new Error('Orders useEntityContext must be used within a Provider');

	return entityContext;
};

export function useListSelector(): TEntity[] {
	const { get, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, get, get);
}

export function useDeleteLoadingSelector(): boolean {
	const { isDeleteLoading, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, isDeleteLoading, isDeleteLoading);
}

export function useEntityIdSelector(): string | undefined {
	const { getEntityId, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, getEntityId, getEntityId);
}

export function useListLoadingSelector(): boolean {
	const { isLoading, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, isLoading, isLoading);
}

export function useAdaptiveTableSelector(): boolean | undefined {
	const { hasAdaptiveTable, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, hasAdaptiveTable, hasAdaptiveTable);
}

export const useSetAdaptiveTableDispatch = () => {
	return useEntityContext().setAdaptiveTable;
};

export const useSetListLoadingDispatch = () => {
	return useEntityContext().setListLoading;
};

export const useSetAllEntitiesDispatch = () => {
	return useEntityContext().setAll;
};

export const useSetDeleteLoadingDispatch = () => {
	return useEntityContext().setDeleteLoading;
};

export function useAmountEntitiesSelector(): number {
	const { amountEntities, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, amountEntities, amountEntities);
}

export const useRemoveDispatch = () => {
	return useEntityContext().remove;
};

export const useSetAllDispatch = () => {
	return useEntityContext().setAll;
};
