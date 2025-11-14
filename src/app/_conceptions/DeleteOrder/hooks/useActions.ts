'use client';

import { useCallback } from 'react';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { deleteEntityById } from '@/services/orders';

import type { TActionsHook, TDeleteEntityParams } from './types';
import {
	useRemoveDispatch,
	useSetDeleteLoadingDispatch
} from '@/app/_conceptions/Orders/context/useContext';

export const useActions = (): TActionsHook => {
	const { setToast } = useControlToaster();
	const removeEntityDispatch = useRemoveDispatch();
	const setDeleteLoadingDispatch = useSetDeleteLoadingDispatch();

	const deleteEntity = useCallback(
		async ({ id, onSuccess }: TDeleteEntityParams) => {
			try {
				setDeleteLoadingDispatch(true);
				await deleteEntityById(id);
				removeEntityDispatch(id);
				if (onSuccess) {
					onSuccess();
				}
			} catch (error) {
				if (typeof Response !== 'undefined' && error instanceof Response) {
					const { message } = await error.json();

					setToast(message, 'error');
				} else {
					setToast('Something wrong with the server!', 'error');
				}
			} finally {
				setDeleteLoadingDispatch(false);
			}
		},
		[]
	);

	return { deleteEntity };
};
