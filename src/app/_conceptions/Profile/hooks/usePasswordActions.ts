'use client';

import { startTransition, useActionState, useCallback } from 'react';

import { passwordSubmit } from '../actions/passwordSubmit';
import type { TPasswordSubmitState } from '../actions/types';

import type { TPasswordActions, TPasswordFormData } from './types';

export const usePasswordActions = (): TPasswordActions => {
	const [state, formAction, isPending] = useActionState<
		TPasswordSubmitState,
		FormData
	>(passwordSubmit, { ok: false });

	const onPasswordSubmit = useCallback(
		(data: TPasswordFormData, locale: string) => {
			const fd = new FormData();
			fd.append('oldPassword', data.oldPassword);
			fd.append('newPassword', data.newPassword);
			fd.append('locale', locale);
			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction]
	);

	return { onPasswordSubmit, state, isPending } as const;
};
