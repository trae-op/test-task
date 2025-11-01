'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TDynamicPageParams } from '@/types/dynamicPage';

import type { TUpdateOrderFormData, TUpdateOrderHookReturn } from './types';
import { updateOrder } from '@/actions/updateOrder/action';
import type { TUpdateOrderSubmitState } from '@/actions/updateOrder/types';

export const useUpdateOrderForm = (): TUpdateOrderHookReturn => {
	const params = useParams<TDynamicPageParams>();
	const { watch } = useFormContext();
	const { formState } = useFormContext<TUpdateOrderFormData>();

	const selectedProducts: MultiValue<OptionType> = watch('productsSelected');

	const [state, formAction, isPending] = useActionState<
		TUpdateOrderSubmitState,
		FormData
	>(updateOrder, { ok: false });

	const isLoading = formState.isSubmitting || isPending;

	const onSubmit = (data: TUpdateOrderFormData) => {
		const fd = new FormData();
		fd.append('orderId', (data.orderId || params.id) as string);
		fd.append('title', data.title || '');
		if (data.description) fd.append('description', data.description);
		const products = (selectedProducts || []).map(p => String(p.value));
		fd.append('products', JSON.stringify(products));

		startTransition(() => {
			formAction(fd);
		});
	};

	return useMemo(
		() => ({
			onSubmit,
			isLoading,
			error: state.message,
			errors: formState.errors
		}),
		[formState.errors, isLoading, state.message]
	);
};
