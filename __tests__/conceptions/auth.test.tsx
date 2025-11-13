import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SignIn } from '@/app/_conceptions/Auth/SignIn/SignIn';
import { SignUp } from '@/app/_conceptions/Auth/SignUp/SignUp';

const signInSpy = jest.fn();
const signUpSpy = jest.fn();

jest.mock('@/hooks/auth', () => ({
	useAuthActions: () => ({
		onSignInSubmit: signInSpy,
		onSignUpSubmit: signUpSpy,
		signInError: '',
		signUpIsPending: false,
		signUpState: { message: '' }
	})
}));

jest.mock('next/navigation', () => ({
	useParams: () => ({ locale: 'en' })
}));

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Auth forms', () => {
	it('should submit sign in when credentials are valid', async () => {
		render(<SignIn />);
		const user = userEvent.setup();
		await user.type(
			screen.getByLabelText(/Email address/i),
			'john@example.com'
		);
		await user.type(screen.getByLabelText(/Password/i), 'Qwerty12');
		await user.click(screen.getByRole('button', { name: /sign in|submit/i }));
		await waitFor(() => expect(signInSpy).toHaveBeenCalledTimes(1));
	});

	it('should not submit sign in when fields are empty', async () => {
		render(<SignIn />);
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /sign in|submit/i }));
		expect(signInSpy).not.toHaveBeenCalled();
	});

	it('should block sign up when passwords mismatch', async () => {
		render(<SignUp />);
		const user = userEvent.setup();
		await user.type(screen.getByLabelText(/Name/i), 'Jane');
		await user.type(
			screen.getByLabelText(/Email address/i),
			'jane@example.com'
		);
		await user.type(screen.getByLabelText(/^Password/i), 'Qwerty12');
		await user.type(screen.getByLabelText(/Confirm password/i), 'Different12');
		await user.click(screen.getByRole('button', { name: /submit|sign up/i }));
		expect(signUpSpy).not.toHaveBeenCalled();
	});
});
