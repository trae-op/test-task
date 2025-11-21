'use server';

import { updateProfile } from './profile';
import type { TProfileSubmitState } from './types';

export const profileSubmit = async (
	_prevState: TProfileSubmitState,
	formData: FormData
): Promise<TProfileSubmitState> => {
	const nameRaw = (formData.get('name') as string) || '';
	const email = String(formData.get('email') || '');

	const res = await updateProfile({ name: nameRaw || null, email });

	const codeToKey: Record<string, string> = {
		UNAUTHORIZED: 'default',
		INVALID_INPUT: 'invalidInput',
		EMAIL_TAKEN: 'User already exists',
		SERVER_ERROR: 'default'
	};

	if (res.ok) {
		return { ok: true };
	}

	return { ok: false, message: codeToKey[res.code] ?? 'default' };
};
