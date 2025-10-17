import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

import type { TAuthActions } from './types';
import { getPathname } from '@/i18n/navigation';

export const useAuthActions = (): TAuthActions => {
	const locale = useLocale();
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
		const callbackUrl = getPathname({ locale, href: '/sign-in' });
		await nextSignOut({ callbackUrl });
	}, [locale]);

	return { signIn, signOut };
};
