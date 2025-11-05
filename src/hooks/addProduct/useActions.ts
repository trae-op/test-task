'use client';

import { startTransition, useActionState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { addProductSubmit } from '../../actions/addProduct/submit';
import type { TAddProductSubmitState } from '../../actions/addProduct/types';

import type {
	TAddProductActions,
	TAddProductFormData,
	TPriceOption
} from './types';

export const useAddProductActions = (): TAddProductActions => {
	const { watch } = useFormContext();
	const [state, formAction, isPending] = useActionState<
		TAddProductSubmitState,
		FormData
	>(addProductSubmit, { ok: false });
	const prices: TPriceOption[] = watch('prices');

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
			if (data.type) fd.append('type', data.type);
			if (data.specification) fd.append('specification', data.specification);
			if (data.guaranteeStart) fd.append('guaranteeStart', data.guaranteeStart);
			if (data.guaranteeEnd) fd.append('guaranteeEnd', data.guaranteeEnd);

			fd.append('prices', JSON.stringify(pricesPayload));

			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction, prices]
	);

	return { onAddProductSubmit, state, isPending } as const;
};
