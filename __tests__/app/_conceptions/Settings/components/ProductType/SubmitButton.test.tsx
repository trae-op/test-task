import { render, screen } from '@testing-library/react';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import { SubmitButton } from '@/app/_conceptions/Settings/components/ProductType/SubmitButton';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('react-hook-form', () => ({
	useFormContext: jest.fn()
}));

jest.mock('react-dom', () => ({
	...jest.requireActual('react-dom'),
	useFormStatus: jest.fn()
}));

describe('ProductType SubmitButton', () => {
	const formContextMock = useFormContext as unknown as jest.Mock;
	const formStatusMock = useFormStatus as unknown as jest.Mock;

	beforeEach(() => {
		formContextMock.mockReturnValue({ formState: { isSubmitting: false } });
		formStatusMock.mockReturnValue({ pending: false });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('is enabled when idle', () => {
			render(<SubmitButton />);
			expect(
				screen.getByTestId('settings-product-type-submit')
			).not.toBeDisabled();
		});
	});

	describe('negative cases', () => {
		test('disables when form submitting', () => {
			formContextMock.mockReturnValueOnce({
				formState: { isSubmitting: true }
			});

			render(<SubmitButton />);
			expect(screen.getByTestId('settings-product-type-submit')).toBeDisabled();
		});
	});

	describe('edge cases', () => {
		test('disables when pending true', () => {
			formStatusMock.mockReturnValueOnce({ pending: true });

			render(<SubmitButton />);
			expect(screen.getByTestId('settings-product-type-submit')).toBeDisabled();
		});
	});
});
