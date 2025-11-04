import { render, screen } from '@testing-library/react';
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

describe('Auth forms', () => {
	it('SignIn positive: submits with valid email and password', async () => {
		render(<SignIn />);
		const user = userEvent.setup();
		await user.type(
			screen.getByPlaceholderText('enterEmail'),
			'john@example.com'
		);
		await user.type(screen.getByPlaceholderText('enterPassword'), 'Qwerty12$');
		await user.click(screen.getByRole('button', { name: /submitButton/i }));
		// No error expected
		expect(screen.queryByText('required')).not.toBeInTheDocument();
	});

	it('SignIn negative: does not call submit with empty fields', async () => {
		render(<SignIn />);
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /submitButton/i }));
		expect(signInSpy).not.toHaveBeenCalled();
	});

	it('SignUp negative: mismatched passwords shows error', async () => {
		render(<SignUp />);
		const user = userEvent.setup();
		await user.type(screen.getByPlaceholderText('enterName'), 'Jane');
		await user.type(
			screen.getByPlaceholderText('enterEmail'),
			'jane@example.com'
		);
		await user.type(screen.getByPlaceholderText('enterPassword'), 'Qwerty12$');
		await user.type(
			screen.getByPlaceholderText('confirmPassword'),
			'Different12$'
		);
		await user.click(screen.getByRole('button', { name: /submitButton/i }));
		expect(signUpSpy).not.toHaveBeenCalled();
	});
});
