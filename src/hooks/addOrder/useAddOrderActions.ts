'use client';

import { startTransition, useActionState, useCallback } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import { addOrderSubmit } from '../../actions/addOrder/submit';
import type { TAddOrderSubmitState } from '../../actions/addOrder/types';

import type { TAddOrderActions, TAddOrderFormData } from './types';

export const useAddOrderActions = (): TAddOrderActions => {
	const [state, formAction, isPending] = useActionState<
		TAddOrderSubmitState,
		FormData
	>(addOrderSubmit, { ok: false });

	const onAddOrderSubmit = useCallback(
		(
			data: TAddOrderFormData,
			products: MultiValue<OptionType>,
			locale: string
		) => {
			const productIds = (products as OptionType[]).map(p => String(p.value));

			const fd = new FormData();
			fd.append('title', data.title);
			if (data.description) fd.append('description', data.description);
			fd.append('products', JSON.stringify(productIds));
			fd.append('locale', locale);

			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction]
	);

	return { onAddOrderSubmit, state, isPending } as const;
};
