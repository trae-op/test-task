'use client';

import { useSession } from 'next-auth/react';
import {
	startTransition,
	useActionState,
	useCallback,
	useEffect,
	useRef
} from 'react';

import { profileSubmit } from '../actions/profileSubmit';
import type { TProfileSubmitState } from '../actions/types';

import type { TProfileActions, TProfileFormData } from './types';

export const useProfileActions = (): TProfileActions => {
	const [state, formAction, isPending] = useActionState<
		TProfileSubmitState,
		FormData
	>(profileSubmit, { ok: false });

	const { update: updateSession, data: session } = useSession();
	const lastSubmittedRef = useRef<TProfileFormData | null>(null);

	const onProfileSubmit = useCallback(
		(data: TProfileFormData, locale: string) => {
			lastSubmittedRef.current = data;
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

	useEffect(() => {
		if (!state.ok) return;
		const submitted = lastSubmittedRef.current;
		if (!submitted) return;

		const needUpdate =
			(session?.user?.email && session.user.email !== submitted.email) ||
			(typeof submitted.name !== 'undefined' &&
				session?.user?.name !== submitted.name);

		if (needUpdate) {
			const payload: Record<string, string> = { email: submitted.email };
			if (typeof submitted.name !== 'undefined') payload.name = submitted.name;
			updateSession(payload);
		}

		lastSubmittedRef.current = null;
	}, [state.ok, session, updateSession]);

	return { onProfileSubmit, state, isPending };
};
