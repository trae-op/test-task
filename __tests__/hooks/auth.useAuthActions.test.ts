import { act, renderHook } from '@testing-library/react';
import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';

import { useAuthActions } from '@/hooks/auth';

// Mock React hooks to control useActionState and startTransition for sign-up
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

// mock router and intl via configured moduleNameMapper (__mocks__)
jest.mock('next-auth/react', () => ({
	signIn: jest.fn(),
	signOut: jest.fn(),
	useSession: () => ({
		data: { user: { email: 'user@old.com', name: 'Old' } },
		update: jest.fn()
	})
}));

// Provide a stable router mock to assert push reliably
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock, replace: jest.fn(), refresh: jest.fn() })
}));

// silence actual implementation to use existing mock file
jest.mock('@/i18n/navigation');

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
		// startTransition is already mocked to run synchronously in this test file

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
		// check FormData entries
		const entries = Array.from((fd as any).entries?.() ?? []);
		const keys = entries.map(([k]: any) => k);
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
