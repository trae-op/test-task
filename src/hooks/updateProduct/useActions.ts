'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { TDynamicPageParams } from '@/types/dynamicPage';

import type {
	TPriceOption,
	TUpdateActionsHook,
	TUpdateFormData
} from './types';
import { updateProduct } from '@/actions/updateProduct';

export const useUpdateActions = (): TUpdateActionsHook => {
	const { watch } = useFormContext();
	const params = useParams<TDynamicPageParams>();
	const prices: TPriceOption[] = watch('prices');
	const [state, formAction, isPending] = useActionState(updateProduct, {
		ok: false
	});

	const onUpdateSubmit = useCallback(
		(data: TUpdateFormData) => {
			const pricesPayload = prices?.map(
				({ value, valueAmount, isDefault }, index) => ({
					symbol: value,
					value: Number(valueAmount ?? 0),
					isDefault: typeof isDefault === 'boolean' ? isDefault : index === 0
				})
			);

			const fd = new FormData();
			fd.append('id', params.id);
			fd.append('title', data.title || '');
			fd.append('isNew', data.isNew ? 'true' : 'false');
			fd.append('serialNumber', data.serialNumber || '');
			fd.append('type', data.type || '');
			fd.append('specification', data.specification || '');
			fd.append('guaranteeStart', String(data.guaranteeStart || ''));
			fd.append('guaranteeEnd', String(data.guaranteeEnd || ''));
			fd.append('prices', JSON.stringify(pricesPayload));

			startTransition(() => {
				formAction(fd);
			});
		},
		[prices, params.id, formAction]
	);

	return { onUpdateSubmit, state, isPending } as const;
};
