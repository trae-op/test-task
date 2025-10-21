'use server';

import { redirect } from 'next/navigation';

import { getProfileHref } from '@/utils/routing/routing';

import { updateProfile } from './profile';
import type { TProfileSubmitState } from './types';

export const profileSubmit = async (
	_prevState: TProfileSubmitState,
	formData: FormData
): Promise<TProfileSubmitState> => {
	const nameRaw = (formData.get('name') as string) || '';
	const email = String(formData.get('email') || '');
	const locale = String(formData.get('locale') || '');

	const res = await updateProfile({ name: nameRaw || null, email });

	if (res.ok) {
		redirect(`/${locale}${getProfileHref()}`);
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		EMAIL_TAKEN: 'User already exists',
		SERVER_ERROR: 'default'
	};
	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
