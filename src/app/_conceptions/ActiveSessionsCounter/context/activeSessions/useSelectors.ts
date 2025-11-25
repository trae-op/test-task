'use client';

import { useSyncExternalStore } from 'react';

import type { TActiveSessionsStatus } from './types';
import { useActiveSessionsContext } from './useContext';

export const useActiveSessionsCountSelector = (): number => {
	const { subscribe, getCount } = useActiveSessionsContext();
	return useSyncExternalStore(subscribe, getCount, getCount);
};

export const useActiveSessionsStatusSelector = (): TActiveSessionsStatus => {
	const { subscribe, getStatus } = useActiveSessionsContext();
	return useSyncExternalStore(subscribe, getStatus, getStatus);
};
