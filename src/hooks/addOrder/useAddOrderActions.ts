'use client';

import { startTransition, useActionState, useCallback } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TAddOrderActions, TAddOrderFormData } from './types';
import { addOrderSubmit } from '@/actions/addOrder/submit';

export const useAddOrderActions = (): TAddOrderActions => {
	const [state, formAction] = useActionState(addOrderSubmit, {
		ok: false
	});

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

	return { onAddOrderSubmit, state } as const;
};
