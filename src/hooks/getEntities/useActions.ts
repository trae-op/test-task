'use client';

import { useCallback, useState } from 'react';

import { getEntityById } from '@/services/orders';

import type { TActionsHook, TGetEntityParams, TRestResults } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);

	const getEntity = useCallback(
		async ({ entityId, onSuccess, entityName }: TGetEntityParams) => {
			setPending(true);
			try {
				const response = await getEntityById<TRestResults>(
					entityName,
					entityId
				);

				if (onSuccess) {
					onSuccess(response);
				}
			} catch (error) {
				// Handle error
			} finally {
				setPending(false);
			}
		},
		[]
	);

	return { getEntity, pending };
};
