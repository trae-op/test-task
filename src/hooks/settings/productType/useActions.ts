'use client';

import { startTransition, useActionState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useActions as useControlToaster } from '@/components/Toaster/useActions';

import { deleteEntityById } from '@/services/settings/productType';

import type { TActions, TSettingsProductTypeFormData } from './types';
import { addProductTypeSubmit } from '@/actions/settings/productType';
import {
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetDeleteLoadingDispatch
} from '@/context/productType/useContext';

export const useActions = (): TActions => {
	const { setToast } = useControlToaster();
	const list = useListSelector();
	const setAll = useSetAllDispatch();
	const removeEntityDispatch = useRemoveDispatch();
	const setDeleteLoadingDispatch = useSetDeleteLoadingDispatch();

	const form = useFormContext<TSettingsProductTypeFormData>();

	const [state, formAction] = useActionState(addProductTypeSubmit, {
		ok: false
	});

	useEffect(() => {
		if (state.ok && state.item) {
			setAll([...(list ?? []), state.item]);
			form.reset();
		}
	}, [state.ok, state.item]);

	const onSubmit = useCallback(
		(data: TSettingsProductTypeFormData) => {
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
