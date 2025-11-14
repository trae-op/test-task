import { act, renderHook } from '@testing-library/react';
import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';

import { useAuthActions } from '@/app/_conceptions/Auth/hooks';

let formActionMock: jest.Mock<any, any>;
let useActionStateState: any;
jest.mock('react', () => {
	const actual = jest.requireActual('react');
	return {
		...actual,
		useActionState: (_fn: any, initial: any) => {
			formActionMock = jest.fn();
			return [useActionStateState ?? initial, formActionMock, false];
		},
		startTransition: (cb: any) => cb()
	};
});

jest.mock('next-auth/react', () => ({
	signIn: jest.fn(),
	signOut: jest.fn(),
	useSession: () => ({
		data: { user: { email: 'user@old.com', name: 'Old' } },
		update: jest.fn()
	})
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock, replace: jest.fn(), refresh: jest.fn() })
}));

jest.mock('@/i18n/navigation');

const getFormDataKeys = (formData: FormData) => {
	const entries = Array.from((formData as any).entries?.() ?? []);
	return entries.map(([key]: any) => key);
};

describe('auth/useAuthActions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('onSignInSubmit: success redirects to orders', async () => {
		(nextSignIn as jest.Mock).mockResolvedValueOnce({ ok: true });

		const { result } = renderHook(() => useAuthActions());

		await act(async () => {
			await result.current.onSignInSubmit({ email: 'a@a.com', password: 'x' });
		});

		expect(pushMock).toHaveBeenCalledWith('/en/orders');
	});

	it('onSignInSubmit: sets invalidCredentials on CredentialsSignin error', async () => {
		(nextSignIn as jest.Mock).mockResolvedValueOnce({
			ok: false,
			error: 'CredentialsSignin'
		});

		const { result } = renderHook(() => useAuthActions());

		await act(async () => {
			await result.current.onSignInSubmit({
				email: 'bad@a.com',
				password: 'nope'
			});
		});

		expect(result.current.signInError).toBe('invalidCredentials');
	});

	it('onSignInSubmit: sets default error on unknown error', async () => {
		(nextSignIn as jest.Mock).mockResolvedValueOnce({
			ok: false,
			error: 'Other'
		});

		const { result } = renderHook(() => useAuthActions());

		await act(async () => {
			await result.current.onSignInSubmit({
				email: 'bad@a.com',
				password: 'nope'
			});
		});

		expect(result.current.signInError).toBe('default');
	});

	it('signOut: calls nextSignOut with callbackUrl from getPathname mock', async () => {
		const { result } = renderHook(() => useAuthActions());

		await act(async () => {
			await result.current.signOut();
		});

		expect(nextSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
	});

	it('onSignUpSubmit: builds FormData and dispatches action via useActionState', () => {
		useActionStateState = { ok: false };

		const { result } = renderHook(() => useAuthActions());

		act(() => {
			result.current.onSignUpSubmit({
				name: 'John',
				email: 'john@example.com',
				password: 'p1',
				confirmPassword: 'p1'
			});
		});

		expect(formActionMock).toHaveBeenCalledTimes(1);
		const fd = formActionMock.mock.calls[0][0] as FormData;
		const keys = getFormDataKeys(fd);
		expect(keys).toEqual(
			expect.arrayContaining([
				'locale',
				'name',
				'email',
				'password',
				'confirmPassword'
			])
		);
	});
});
