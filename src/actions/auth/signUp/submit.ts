'use server';

import { redirect } from 'next/navigation';

import { signUp } from './action';

export type TSignUpSubmitState = { ok: boolean; message?: string };

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
	return { ok: false, message: res.message };
};
