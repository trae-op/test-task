'use client';

import { startTransition, useActionState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import type { TActions, TSettingsCurrencyFormData } from './types';
import { addCurrencySubmit, deleteCurrency } from '@/actions/settings/currency';
import {
	useListSelector,
	useSetAllDispatch
} from '@/context/currency/useContext';

export const useActions = (): TActions => {
	const list = useListSelector();
	const setAll = useSetAllDispatch();

	const form = useFormContext<TSettingsCurrencyFormData>();

	const [state, formAction] = useActionState(addCurrencySubmit, { ok: false });
	const [_, deleteFormAction] = useActionState(deleteCurrency, { ok: false });

	useEffect(() => {
		if (state.ok && state.item) {
			setAll([...(list ?? []), state.item]);
			form.reset();
		}
	}, [state.ok, state.item]);

	const onSubmit = useCallback(
		(data: TSettingsCurrencyFormData) => {
			const fd = new FormData();
			fd.append('title', data.title);
			fd.append('value', data.value);

			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction]
	);

	const deleteEntity = useCallback((id: string) => {
		const fd = new FormData();
		fd.append('id', id);

		startTransition(() => {
			deleteFormAction(fd);
		});
	}, []);

	return { onSubmit, state, deleteEntity };
};
