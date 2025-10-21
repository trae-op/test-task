'use client';

import { startTransition, useActionState, useCallback } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/ui/MultiSelectField/types';

import { addProductSubmit } from '../../actions/addProduct/submit';
import type { TAddProductSubmitState } from '../../actions/addProduct/types';

import type { TAddProductActions, TAddProductFormData } from './types';

export const useAddProductActions = (): TAddProductActions => {
	const [state, formAction, isPending] = useActionState<
		TAddProductSubmitState,
		FormData
	>(addProductSubmit, { ok: false });

	const onAddProductSubmit = useCallback(
		(
			data: TAddProductFormData,
			prices: MultiValue<OptionType>,
			locale: string
		) => {
			const anyPrices = prices as unknown as Array<any>;
			const pricesPayload = anyPrices.map((p, idx) => ({
				symbol: p.value as 'USD' | 'UAH',
				value: Number(p.valueAmount ?? 0),
				isDefault: typeof p.isDefault === 'boolean' ? p.isDefault : idx === 0
			}));

			const fd = new FormData();
			fd.append('title', data.title);
			fd.append('serialNumber', data.serialNumber);
			if (data.type) fd.append('type', data.type);
			if (data.specification) fd.append('specification', data.specification);
			if (data.guaranteeStart) fd.append('guaranteeStart', data.guaranteeStart);
			if (data.guaranteeEnd) fd.append('guaranteeEnd', data.guaranteeEnd);
			if (data.orderId) fd.append('orderId', data.orderId);
			fd.append('prices', JSON.stringify(pricesPayload));
			fd.append('locale', locale);

			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction]
	);

	return { onAddProductSubmit, state, isPending } as const;
};
