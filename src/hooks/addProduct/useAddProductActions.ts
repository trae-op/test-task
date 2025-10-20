'use client';

import { startTransition, useActionState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import type {
	TAddProductFormData,
	TAddProductState,
	TPriceOption,
	TSelectOption,
	TUseAddProduct
} from './types';
import { addProductSubmit } from '@/actions/addProduct/submit';
import type { TAddProductSubmitState } from '@/actions/addProduct/types';

export const useAddProductActions = (
	state: TAddProductState & {
		setSelectedOrders: (opts: MultiValue<TSelectOption>) => void;
		setSelectedPrice: (opt?: TPriceOption) => void;
	}
): TUseAddProduct => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TAddProductFormData>({ mode: 'onBlur' });

	const [addProductState, addProductFormAction, addProductIsPending] =
		useActionState<TAddProductSubmitState, FormData>(addProductSubmit, {
			ok: false
		});

	const handlePriceSelect = useCallback(
		(value: string | number) => {
			const opt = state.priceOptions.find(
				o => String(o.value) === String(value)
			);
			state.setSelectedPrice(opt);
		},
		[state]
	);

	const handleOrdersChange = useCallback(
		(opts: MultiValue<TSelectOption>) => {
			state.setSelectedOrders(opts);
		},
		[state]
	);

	const onSubmit = useCallback(
		(data: TAddProductFormData, onClose?: () => void) => {
			const fd = new FormData();
			// Basic fields
			fd.append('title', data.title ?? '');
			fd.append('type', data.type ?? '');
			if (data.specification) fd.append('specification', data.specification);
			fd.append('guaranteeStart', data.guaranteeStart ?? '');
			fd.append('guaranteeEnd', data.guaranteeEnd ?? '');

			// price (from controlled select)
			if (state.selectedPrice) {
				fd.append('price.value', String(state.selectedPrice.value));
				fd.append('price.symbol', state.selectedPrice.label);
			}

			// orders
			if (state.selectedOrders && state.selectedOrders.length > 0) {
				state.selectedOrders.forEach(o => fd.append('orders[]', o.value));
			}

			startTransition(() => {
				addProductFormAction(fd);
			});

			onClose?.();
		},
		[addProductFormAction, state.selectedOrders, state.selectedPrice]
	);

	const submitViaApply = useCallback(
		(onClose: () => void) => {
			// use handleSubmit to validate required fields from react-hook-form
			void handleSubmit(data => onSubmit(data, onClose))();
		},
		[handleSubmit, onSubmit]
	);

	return {
		...state,
		register,
		errors,
		isSubmitting,
		addProductIsPending,
		handlePriceSelect,
		handleOrdersChange,
		submitViaApply
	};
};
