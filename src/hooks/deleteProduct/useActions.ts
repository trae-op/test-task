'use client';

import { useCallback, useState } from 'react';

import { deleteProductById } from '@/services/products';

import type { TActionsHook, TDeleteEntityParams } from './types';

export const useActions = (): TActionsHook => {
	const [pending, setPending] = useState(false);

	const deleteEntity = useCallback(
		async ({ id, onSuccess }: TDeleteEntityParams) => {
			setPending(true);
			try {
				await deleteProductById('products', id);
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
