'use client';

import { useCallback } from 'react';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { getEntities } from '@/services/orders';

import type { TActionsHook, TGetEntitiesParams, TRestResults } from './types';
import { useSetListLoadingDispatch } from '@/context/orders/useContext';

export const useActions = (): TActionsHook => {
	const { setToast } = useControlToaster();
	const listLoadingDispatch = useSetListLoadingDispatch();

	const getAllEntities = useCallback(
		async ({ onSuccess, params }: TGetEntitiesParams) => {
			try {
				listLoadingDispatch(true);

				const response = await getEntities<TRestResults>(params);

				if (onSuccess) {
					onSuccess(response);
				}
			} catch (error) {
				setToast('Error fetching entities', 'error');
			} finally {
				listLoadingDispatch(false);
			}
		},
		[setToast]
	);

	return { getAllEntities };
};
