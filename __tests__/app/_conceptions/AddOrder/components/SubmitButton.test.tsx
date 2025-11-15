import { render, screen } from '@testing-library/react';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import { SubmitButton } from '@/app/_conceptions/AddOrder/components/SubmitButton';

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

jest.mock('react-hook-form', () => ({
	useFormContext: jest.fn()
}));

jest.mock('react-dom', () => ({
	...jest.requireActual('react-dom'),
	useFormStatus: jest.fn()
}));

describe('SubmitButton', () => {
	const formContextMock = useFormContext as unknown as jest.Mock;
	const formStatusMock = useFormStatus as unknown as jest.Mock;

	beforeEach(() => {
		formContextMock.mockReturnValue({ formState: { isSubmitting: false } });
		formStatusMock.mockReturnValue({ pending: false });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders enabled submit button when idle', () => {
		render(<SubmitButton />);

		const button = screen.getByTestId('add-order-submit');
		expect(button).not.toBeDisabled();
	});

	test('disables button when form submitting', () => {
		formContextMock.mockReturnValueOnce({ formState: { isSubmitting: true } });
		render(<SubmitButton />);

		const button = screen.getByTestId('add-order-submit');
		expect(button).toBeDisabled();
	});

	test('disables button when form status pending', () => {
		formStatusMock.mockReturnValueOnce({ pending: true });
		render(<SubmitButton />);

		expect(screen.getByTestId('add-order-submit')).toBeDisabled();
	});
});
