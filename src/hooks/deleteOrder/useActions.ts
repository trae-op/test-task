'use client';

import { useCallback, useState } from 'react';

import { deleteOrderById } from '@/services/orders';

import type { TActions } from './types';

export const useActions = (): TActions => {
	const [pending, setPending] = useState(false);

	const deleteEntity = useCallback(async (id: string) => {
		setPending(true);
		try {
			await deleteOrderById('orders', id);
		} catch (error) {
			// Handle error
		} finally {
			setPending(false);
		}
	}, []);

	return { deleteEntity, pending };
};
