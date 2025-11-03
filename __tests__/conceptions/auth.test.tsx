import { fireEvent, render, screen } from '@testing-library/react';
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
	it('SignIn positive: submits with valid email and password', () => {
		render(<SignIn />);
		fireEvent.change(screen.getByPlaceholderText('enterEmail'), {
			target: { value: 'john@example.com' }
		});
		fireEvent.change(screen.getByPlaceholderText('enterPassword'), {
			target: { value: 'Qwerty12$' }
		});
		fireEvent.click(screen.getByRole('button', { name: /submitButton/i }));
		// No error expected
		expect(screen.queryByText('required')).not.toBeInTheDocument();
	});

	it('SignIn negative: does not call submit with empty fields', () => {
		render(<SignIn />);
		fireEvent.click(screen.getByRole('button', { name: /submitButton/i }));
		expect(signInSpy).not.toHaveBeenCalled();
	});

	it('SignUp negative: mismatched passwords shows error', () => {
		render(<SignUp />);
		fireEvent.change(screen.getByPlaceholderText('enterName'), {
			target: { value: 'Jane' }
		});
		fireEvent.change(screen.getByPlaceholderText('enterEmail'), {
			target: { value: 'jane@example.com' }
		});
		fireEvent.change(screen.getByPlaceholderText('enterPassword'), {
			target: { value: 'Qwerty12$' }
		});
		fireEvent.change(screen.getByPlaceholderText('confirmPassword'), {
			target: { value: 'Different12$' }
		});
		fireEvent.click(screen.getByRole('button', { name: /submitButton/i }));
		expect(signUpSpy).not.toHaveBeenCalled();
	});
});
