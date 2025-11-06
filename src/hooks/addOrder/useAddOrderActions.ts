'use client';

import { startTransition, useCallback } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TAddOrderActions, TAddOrderFormData } from './types';

export const useAddOrderActions = (): TAddOrderActions => {
	const onAddOrderSubmit = useCallback(
		(
			data: TAddOrderFormData,
			products: MultiValue<OptionType>,
			locale: string,
			actionsCallback: (data: FormData) => void
		) => {
			const productIds = (products as OptionType[]).map(p => String(p.value));

			const fd = new FormData();
			fd.append('title', data.title);
			if (data.description) fd.append('description', data.description);
			fd.append('products', JSON.stringify(productIds));
			fd.append('locale', locale);

			startTransition(() => {
				actionsCallback(fd);
			});
		},
		[]
	);

	return { onAddOrderSubmit } as const;
};
