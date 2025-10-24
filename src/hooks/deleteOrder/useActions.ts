'use client';

import { useCallback, useState } from 'react';

import { deleteOrderById } from '@/services/orders';

import type { TActionsHook, TDeleteEntityParams } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);

	const deleteEntity = useCallback(
		async ({ id, cabSuccess }: TDeleteEntityParams) => {
			setPending(true);
			try {
				await deleteOrderById('orders', id);
				if (cabSuccess) {
					cabSuccess();
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
