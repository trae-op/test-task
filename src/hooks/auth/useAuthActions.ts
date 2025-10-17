import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';
import { useCallback } from 'react';

import type { TAuthActions } from './types';

export const useAuthActions = (): TAuthActions => {
	const signIn = useCallback(async (email: string, password: string) => {
		const res = await nextSignIn('credentials', {
			redirect: false,
			email,
			password
		});
		if (!res) return { ok: false, error: 'Unknown error' };
		return { ok: res.ok ?? false, error: res.error ?? undefined };
	}, []);

	const signOut = useCallback(async () => {
		await nextSignOut({ redirect: false });
	}, []);

	return { signIn, signOut };
};
