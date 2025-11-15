'use client';

import { useParams } from 'next/navigation';
import {
	startTransition,
	useActionState,
	useCallback,
	useEffect,
	useMemo
} from 'react';
import { useFormContext } from 'react-hook-form';

import { addProductSubmit } from '../actions/submit';

import type {
	TAddProductActions,
	TAddProductFormData,
	TPriceOption
} from './types';

export const useActions = (): TAddProductActions => {
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const { watch } = useFormContext();
	const prices: TPriceOption[] = watch('prices');

	const [state, formAction] = useActionState(addProductSubmit, {
		ok: false
	});

	useEffect(() => {
		if (state?.message) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [state?.message]);

	const onAddProductSubmit = useCallback(
		(data: TAddProductFormData) => {
			const pricesPayload = prices?.map((p, idx) => ({
				symbol: p.value,
				value: Number(p.valueAmount ?? 0),
				isDefault: typeof p.isDefault === 'boolean' ? p.isDefault : idx === 0
			}));

			const fd = new FormData();
			fd.append('title', data.title);
			fd.append('serialNumber', data.serialNumber);
			fd.append('isNew', data.isNew ? 'true' : 'false');
			fd.append('locale', locale);
			if (data.type) fd.append('type', data.type);
			if (data.specification) fd.append('specification', data.specification);
			if (data.guaranteeStart) fd.append('guaranteeStart', data.guaranteeStart);
			if (data.guaranteeEnd) fd.append('guaranteeEnd', data.guaranteeEnd);

			fd.append('prices', JSON.stringify(pricesPayload));

			startTransition(() => {
				formAction(fd);
			});
		},
		[prices, formAction, locale]
	);

	return useMemo(
		() => ({ onAddProductSubmit, error: state?.message }),
		[onAddProductSubmit, state?.message]
	);
};
export const useAddProductActions = useActions;
