'use client';

import { useContext, useSyncExternalStore } from 'react';

import { Context } from './Context';
import type { TActiveSessionsStatus } from './types';

export const useActiveSessionsContext = () => {
	const ctx = useContext(Context);

	if (!ctx) {
		throw new Error(
			'useActiveSessionsContext must be used within ActiveSessions Provider'
		);
	}

	return ctx;
};

export const useActiveSessionsCountSelector = (): number => {
	const { subscribe, getCount } = useActiveSessionsContext();
	return useSyncExternalStore(subscribe, getCount, getCount);
};

export const useActiveSessionsStatusSelector = (): TActiveSessionsStatus => {
	const { subscribe, getStatus } = useActiveSessionsContext();
	return useSyncExternalStore(subscribe, getStatus, getStatus);
};
