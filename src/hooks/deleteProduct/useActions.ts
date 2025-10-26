'use client';

import { useCallback, useState } from 'react';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { deleteEntityById } from '@/services/products';

import type { TActionsHook, TDeleteEntityParams } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);
	const { setToast } = useControlToaster();

	const deleteEntity = useCallback(
		async ({ id, onSuccess }: TDeleteEntityParams) => {
			setPending(true);
			try {
				await deleteEntityById(id);
				if (onSuccess) {
					onSuccess();
				}
			} catch (_error) {
				setToast('Error deleting entity', 'error');
			} finally {
				setPending(false);
			}
		},
		[]
	);

	return { deleteEntity, pending };
};
