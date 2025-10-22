'use server';

import { redirect } from 'next/navigation';

import { getProfileHref } from '@/utils/routing/routing';

import { updatePassword } from './password';
import type { TPasswordSubmitState } from './types';

export const passwordSubmit = async (
	_prevState: TPasswordSubmitState,
	formData: FormData
): Promise<TPasswordSubmitState> => {
	const oldPassword = String(formData.get('oldPassword') || '');
	const newPassword = String(formData.get('newPassword') || '');
	const locale = String(formData.get('locale') || '');

	const res = await updatePassword({ oldPassword, newPassword });

	if (res.ok) {
		redirect(`/${locale}${getProfileHref}`);
	}

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		WRONG_PASSWORD: 'wrongPassword',
		SERVER_ERROR: 'default'
	};
	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
