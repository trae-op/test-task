'use server';

import { redirect } from 'next/navigation';

import { signUp } from './action';
import type { TSignUpSubmitState } from './types';

export const signUpSubmit = async (
	_prevState: TSignUpSubmitState,
	formData: FormData
): Promise<TSignUpSubmitState> => {
	const email = String(formData.get('email') || '');
	const password = String(formData.get('password') || '');
	const confirmPassword = String(formData.get('confirmPassword') || '');
	const name = String(formData.get('name') || '');
	const locale = String(formData.get('locale') || '');

	const res = await signUp({ email, password, confirmPassword, name });
	if (res.ok) {
		redirect(`/${locale}/sign-in?registered=1`);
	}
	const codeToKey: Record<string, string> = {
		USER_EXISTS: 'User already exists',
		INVALID_INPUT: 'invalidInput',
		PASSWORD_MISMATCH: 'passwordMatch',
		WEAK_PASSWORD: 'password',
		SERVER_ERROR: 'default',
		WRONG_PASSWORD: 'wrongPassword'
	};
	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
