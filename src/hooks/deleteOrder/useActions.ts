'use client';

import { useCallback, useState } from 'react';

import { deleteEntityById } from '@/services/deleteEntity';

import type { TActionsHook, TDeleteEntityParams } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);

	const deleteEntity = useCallback(
		async ({ id, onSuccess, entityName }: TDeleteEntityParams) => {
			setPending(true);
			try {
				await deleteEntityById(entityName, id);
				if (onSuccess) {
					onSuccess();
				}
			} catch (error) {
				// Handle error
			} finally {
				setPending(false);
			}
		},
		[]
	);

	return { deleteEntity, pending };
};
