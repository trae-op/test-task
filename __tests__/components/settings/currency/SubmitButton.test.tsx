import { render, screen } from '@testing-library/react';
import React from 'react';

import { SubmitButton } from '@/app/_conceptions/Settings/Currency/SubmitButton';

jest.mock('react-hook-form', () => {
	const actual = jest.requireActual('react-hook-form');
	return {
		...actual,
		useFormContext: () => ({ formState: { isSubmitting: false } })
	};
});

jest.mock('react-dom', () => {
	const actual = jest.requireActual('react-dom');
	return {
		...actual,
		useFormStatus: () => ({ pending: false })
	};
});

// Mock Button to inspect props
jest.mock('@/components/Button', () => ({
	Button: (props: any) => (
		<button type={props.type} disabled={props.disabled}>
			{props.isLoading ? <span role='status' /> : props.text}
		</button>
	)
}));

describe('components/settings/currency/SubmitButton', () => {
	it('renders enabled when not pending or submitting', () => {
		render(<SubmitButton />);
		const btn = screen.getByRole('button', { name: 'Submit' });
		expect(btn).toBeEnabled();
	});
});
