import { render, screen } from '@testing-library/react';

import { TextField } from '@/components/TextField';

describe('TextField', () => {
	test('renders input with given value and placeholder', () => {
		const value = 'John Doe';
		const placeholder = 'Enter name';

		render(
			<TextField
				data-testid='text-field-input'
				value={value}
				placeholder={placeholder}
			/>
		);

		const input = screen.getByTestId('text-field-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveDisplayValue(value);
		expect(input).toHaveAttribute('placeholder', placeholder);
	});

	test('renders error message when errorMessage prop is provided', () => {
		const errorMessage = 'This field is required';

		render(
			<TextField
				data-testid='text-field-input'
				value=''
				errorMessage={errorMessage}
			/>
		);

		const error = screen.getByText(errorMessage);
		expect(error).toBeInTheDocument();
	});
});
