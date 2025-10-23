'use client';

import { useCallback, useState } from 'react';

import { deleteProductById } from '@/services/products';

import type { TActions } from './types';

export const useActions = (): TActions => {
	const [pending, setPending] = useState(false);

	const deleteEntity = useCallback(async (id: string) => {
		setPending(true);
		try {
			await deleteProductById('products', id);
		} catch (error) {
			// Handle error
		} finally {
			setPending(false);
		}
	}, []);

	return { deleteEntity, pending };
};
