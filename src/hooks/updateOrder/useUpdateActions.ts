'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TDynamicPageParams } from '@/types/dynamicPage';

import type { TUpdateOrderFormData, TUpdateOrderHookReturn } from './types';
import { updateOrder } from '@/actions/updateOrder/action';

export const useUpdateActions = (): TUpdateOrderHookReturn => {
	const params = useParams<TDynamicPageParams>();
	const { watch } = useFormContext();

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

	return useMemo(
		() => ({
			onSubmit,
			error: state?.message
		}),
		[onSubmit, state?.message]
	);
};
