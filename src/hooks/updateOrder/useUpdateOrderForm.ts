'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TDynamicPageParams } from '@/types/dynamicPage';

import type { TUpdateOrderFormData, TUpdateOrderHookReturn } from './types';
import { updateOrder } from '@/actions/updateOrder/action';

export const useUpdateOrderForm = (): TUpdateOrderHookReturn => {
	const params = useParams<TDynamicPageParams>();
	const { watch, formState } = useFormContext();

	const selectedProducts: MultiValue<OptionType> = watch('productsSelected');
	const [state, formAction] = useActionState(updateOrder, { ok: false });

	const onSubmit = useCallback(
		(data: TUpdateOrderFormData) => {
			const fd = new FormData();
			fd.append('orderId', (data.orderId || params.id) as string);
			fd.append('title', data.title || '');
			if (data.description) fd.append('description', data.description);
			const products = (selectedProducts || []).map(p => String(p.value));
			fd.append('products', JSON.stringify(products));

			startTransition(() => {
				formAction(fd);
			});
		},
		[params.id, selectedProducts, formAction]
	);

	return {
		onSubmit,
		isLoading: !!formState?.isSubmitting,
		error: state?.message,
		errors: formState?.errors ?? {}
	} as const;
};
