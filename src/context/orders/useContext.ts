'use client';

import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import { TEntity } from './types';

export const useEntityContext = () => {
	const entityContext = useContext(Context);

	if (!entityContext)
		throw new Error('Order useEntityContext must be used within a Provider');

	return entityContext;
};

export function useListSelector(): TEntity[] {
	const { get, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, get, get);
}

export const useRemoveDispatch = () => {
	return useEntityContext().remove;
};

export const useSetAllDispatch = () => {
	return useEntityContext().setAll;
};
