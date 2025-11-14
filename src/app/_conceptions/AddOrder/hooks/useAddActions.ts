'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useCallback, useMemo } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import { addOrderSubmit } from '../actions/submit';

import type { TAddOrderActions, TAddOrderFormData } from './types';

export const useAddActions = (): TAddOrderActions => {
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const [state, formAction] = useActionState(addOrderSubmit, {
		ok: false
	});

	const onAddOrderSubmit = useCallback(
		(data: TAddOrderFormData, products: MultiValue<OptionType>) => {
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
		[formAction, locale]
	);

	return useMemo(
		() => ({ onAddOrderSubmit, error: state?.message }),
		[onAddOrderSubmit, state?.message]
	);
};

export const useAddOrderActions = useAddActions;
