'use client';

import { useParams } from 'next/navigation';
import { startTransition, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TDynamicPageParams } from '@/types/dynamicPage';

import type { TUpdateOrderFormData, TUpdateOrderHookReturn } from './types';

export const useUpdateOrderForm = (): TUpdateOrderHookReturn => {
	const params = useParams<TDynamicPageParams>();
	const { watch } = useFormContext();

	const selectedProducts: MultiValue<OptionType> = watch('productsSelected');

	const onSubmit = useCallback(
		(data: TUpdateOrderFormData, actionsCallback: (data: FormData) => void) => {
			const fd = new FormData();
			fd.append('orderId', (data.orderId || params.id) as string);
			fd.append('title', data.title || '');
			if (data.description) fd.append('description', data.description);
			const products = (selectedProducts || []).map(p => String(p.value));
			fd.append('products', JSON.stringify(products));

			startTransition(() => {
				actionsCallback(fd);
			});
		},
		[params.id, selectedProducts]
	);

	return { onSubmit } as const;
};
