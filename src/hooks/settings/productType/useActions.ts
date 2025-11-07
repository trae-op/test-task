'use client';

import { startTransition, useActionState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import type { TActions, TSettingsProductTypeFormData } from './types';
import {
	addProductTypeSubmit,
	deleteProductType
} from '@/actions/settings/productType';
import {
	useListSelector,
	useSetAllDispatch
} from '@/context/productType/useContext';

export const useActions = (): TActions => {
	const list = useListSelector();
	const setAll = useSetAllDispatch();

	const form = useFormContext<TSettingsProductTypeFormData>();

	const [state, formAction] = useActionState(addProductTypeSubmit, {
		ok: false
	});
	const [_, deleteFormAction] = useActionState(deleteProductType, {
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

	const deleteEntity = useCallback((id: string) => {
		const fd = new FormData();
		fd.append('id', id);

		startTransition(() => {
			deleteFormAction(fd);
		});
	}, []);

	return { onSubmit, state, deleteEntity };
};
