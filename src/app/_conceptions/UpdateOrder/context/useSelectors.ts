import { useSyncExternalStore } from 'react';

import type { TEntity } from './types';
import { useEntityContext } from './useContext';

export const useListSelector = (): TEntity[] => {
	const { get, subscribe } = useEntityContext();
	return useSyncExternalStore(subscribe, get, get);
};
