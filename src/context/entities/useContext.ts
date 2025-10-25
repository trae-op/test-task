import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import { TEntity } from './types';

export const useEntityContext = () => {
	const entityContext = useContext(Context);

	if (!entityContext)
		throw new Error('useEntityContext must be used within a Provider');

	return entityContext;
};

export function useListSelector<T = TEntity>(): T[] {
	const { get, subscribe } = useEntityContext();
	const getEntities = () => get() as T[];
	return useSyncExternalStore(subscribe, getEntities, getEntities);
}

export const useRemoveDispatch = () => {
	return useEntityContext().remove;
};
