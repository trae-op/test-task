'use client';

import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
	startTransition,
	useActionState,
	useCallback,
	useMemo,
	useState
} from 'react';

import { getOrdersHref } from '@/utils/routing/routing';

import { signUpSubmit } from '../actions/submit';
import type { TSignUpSubmitState } from '../actions/types';

import type { TAuthActions } from './types';
import { getPathname } from '@/i18n/navigation';

export const useAuthActions = (): TAuthActions => {
	const locale = useLocale();
	const router = useRouter();
	const [signInIsPending, setSignInIsPending] = useState(false);
	const [signInError, setSignInError] = useState<string | null>(null);

	const signIn = useCallback(async (email: string, password: string) => {
		const res = await nextSignIn('credentials', {
			redirect: false,
			email,
			password
		});
		if (!res) return { ok: false, error: 'Unknown error' };
		return { ok: res.ok ?? false, error: res.error ?? undefined };
	}, []);

	const onSignInSubmit = useCallback(
		async (data: { email: string; password: string }) => {
			setSignInError(null);
			setSignInIsPending(true);
			const res = await signIn(data.email, data.password);

			if (!res.ok) {
				const message =
					res.error === 'CredentialsSignin' ? 'invalidCredentials' : 'default';
				setSignInError(message);
				setSignInIsPending(false);
				return;
			}
			router.push(`/${locale}${getOrdersHref}`);
			// setSignInIsPending(false);
		},
		[router, locale, signIn]
	);

	const signOut = useCallback(async () => {
		const callbackUrl = getPathname({ locale, href: '/sign-in' });
		await nextSignOut({ callbackUrl });
	}, [locale]);

	const [signUpState, signUpFormAction, signUpIsPending] = useActionState<
		TSignUpSubmitState,
		FormData
	>(signUpSubmit, { ok: false });

	const onSignUpSubmit = useCallback(
		(data: {
			name: string;
			email: string;
			password: string;
			confirmPassword: string;
		}) => {
			const fd = new FormData();
			fd.append('locale', locale);
			fd.append('name', data.name);
			fd.append('email', data.email);
			fd.append('password', data.password);
			fd.append('confirmPassword', data.confirmPassword);
			startTransition(() => {
				signUpFormAction(fd);
			});
		},
		[locale, signUpFormAction]
	);

	return useMemo(
		() => ({
			signOut,
			onSignInSubmit,
			onSignUpSubmit,
			signUpState,
			signUpIsPending,
			signInIsPending,
			signInError
		}),
		[
			signOut,
			onSignInSubmit,
			onSignUpSubmit,
			signUpState,
			signUpIsPending,
			signInIsPending,
			signInError
		]
	);
};
