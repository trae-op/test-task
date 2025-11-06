'use client';

import { startTransition, useActionState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { deleteEntityById } from '@/services/settings/currency';

import type { TActions, TSettingsCurrencyFormData } from './types';
import { addCurrencySubmit } from '@/actions/settings/currency';
import {
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetDeleteLoadingDispatch
} from '@/context/currency/useContext';

export const useActions = (): TActions => {
	const { setToast } = useControlToaster();
	const list = useListSelector();
	const setAll = useSetAllDispatch();
	const removeEntityDispatch = useRemoveDispatch();
	const setDeleteLoadingDispatch = useSetDeleteLoadingDispatch();

	const form = useFormContext<TSettingsCurrencyFormData>();

	const [state, formAction] = useActionState(addCurrencySubmit, { ok: false });

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

	const deleteEntity = useCallback(
		async ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
			try {
				setDeleteLoadingDispatch(true);
				await deleteEntityById(id);
				removeEntityDispatch(id);
				if (onSuccess) onSuccess();
			} catch (error) {
				setToast('Error deleting entity', 'error');
			} finally {
				setDeleteLoadingDispatch(false);
			}
		},
		[]
	);

	return { onSubmit, state, deleteEntity };
};
