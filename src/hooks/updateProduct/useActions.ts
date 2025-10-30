'use client';

import { useParams } from 'next/navigation';
import { startTransition, useActionState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import { TDynamicPageParams } from '@/types/dynamicPage';

import { updateProductSubmit } from '../../actions/updateProduct/submit';
import type { TUpdateProductSubmitState } from '../../actions/updateProduct/types';

import type { TUpdateProductActions, TUpdateProductFormData } from './types';

export const useUpdateProductActions = (): TUpdateProductActions => {
	const { watch } = useFormContext();
	const [state, formAction, isPending] = useActionState<
		TUpdateProductSubmitState,
		FormData
	>(updateProductSubmit, { ok: false });
	const params = useParams<TDynamicPageParams>();
	const prices = watch('prices') || [];

	const onUpdateProductSubmit = useCallback(
		(
			data: TUpdateProductFormData,
			_prices: MultiValue<OptionType>,
			locale: string
		) => {
			const anyPrices = prices as unknown as Array<any>;
			const pricesPayload = anyPrices.map((p, idx) => ({
				symbol: p.value,
				value: Number(p.valueAmount ?? 0),
				isDefault: typeof p.isDefault === 'boolean' ? p.isDefault : idx === 0
			}));

			const fd = new FormData();
			fd.append('id', params.id);
			fd.append('title', data.title);
			fd.append('isNew', data.isNew ? 'true' : 'false');
			fd.append('serialNumber', data.serialNumber);
			if (data.type) fd.append('type', data.type);
			if (data.specification) fd.append('specification', data.specification);
			if (data.guaranteeStart) fd.append('guaranteeStart', data.guaranteeStart);
			if (data.guaranteeEnd) fd.append('guaranteeEnd', data.guaranteeEnd);

			fd.append('prices', JSON.stringify(pricesPayload));
			fd.append('locale', locale);

			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction, prices]
	);

	return { onUpdateProductSubmit, state, isPending } as const;
};
