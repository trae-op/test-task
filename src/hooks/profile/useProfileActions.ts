'use client';

import { startTransition, useActionState, useCallback } from 'react';

import { profileSubmit } from '../../actions/profile/profileSubmit';
import type { TProfileSubmitState } from '../../actions/profile/types';

import type { TProfileActions, TProfileFormData } from './types';

export const useProfileActions = (): TProfileActions => {
	const [state, formAction, isPending] = useActionState<
		TProfileSubmitState,
		FormData
	>(profileSubmit, { ok: false });

	const onProfileSubmit = useCallback(
		(data: TProfileFormData, locale: string) => {
			const fd = new FormData();
			if (data.name !== undefined) fd.append('name', data.name);
			fd.append('email', data.email);
			fd.append('locale', locale);
			startTransition(() => {
				formAction(fd);
			});
		},
		[formAction]
	);

	return { onProfileSubmit, state, isPending } as const;
};
