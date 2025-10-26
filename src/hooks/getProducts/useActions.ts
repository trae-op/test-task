'use client';

import { useCallback, useMemo, useState } from 'react';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { getEntities } from '@/services/products';

import type { TActionsHook, TGetEntitiesParams, TRestResults } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);
	const { setToast } = useControlToaster();

	const getAllEntities = useCallback(
		async ({ onSuccess, params }: TGetEntitiesParams) => {
			setPending(true);
			try {
				const response = await getEntities<TRestResults>(params);
				if (onSuccess) onSuccess(response);
			} catch (error) {
				setToast('Error fetching entities', 'error');
			} finally {
				setPending(false);
			}
		},
		[setToast]
	);

	return useMemo(
		() => ({ getAllEntities, pending }),
		[getAllEntities, pending]
	);
};
