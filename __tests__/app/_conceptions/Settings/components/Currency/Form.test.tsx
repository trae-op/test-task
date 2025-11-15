import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormCurrency } from '@/app/_conceptions/Settings/components/Currency/Form';
import { useActions } from '@/app/_conceptions/Settings/hooks/currency';
import type {
	TActions,
	TSettingsCurrencyFormData
} from '@/app/_conceptions/Settings/hooks/currency/types';

jest.mock('next-intl', () => ({
	useTranslations: () => (value: string) => value
}));

jest.mock('@/app/_conceptions/Settings/components/Currency/List', () => ({
	CurrencyList: () => <div data-testid='settings-currency-list-mock' />
}));

jest.mock('@/app/_conceptions/Settings/hooks/currency', () => ({
	useActions: jest.fn()
}));

describe('FormCurrency', () => {
	let mockActions: TActions;

	const renderWithProvider = () => {
		const Wrapper = ({ children }: { children: ReactNode }) => {
			const methods = useForm<TSettingsCurrencyFormData>({ mode: 'onBlur' });
			return <FormProvider {...methods}>{children}</FormProvider>;
		};

		render(
			<Wrapper>
				<FormCurrency />
			</Wrapper>
		);
	};

	beforeEach(() => {
		mockActions = {
			onSubmit: jest.fn(),
			state: { ok: false },
			deleteEntity: jest.fn()
		};
		(useActions as jest.Mock).mockReturnValue(mockActions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('submits valid data through hook', async () => {
			const user = userEvent.setup();
			renderWithProvider();

			await user.type(screen.getByLabelText('Title'), 'Dollar');
			await user.type(screen.getByLabelText('Value'), 'USD');

			const form = screen.getByTestId('settings-currency-form');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(mockActions.onSubmit).toHaveBeenCalledWith({
				title: 'Dollar',
				value: 'USD'
			});
		});
	});

	describe('negative cases', () => {
		test('shows validation message when required fields missing', async () => {
			renderWithProvider();
			const form = screen.getByTestId('settings-currency-form');

			await act(async () => {
				fireEvent.submit(form);
			});

			expect(
				screen.getByTestId('settings-currency-error-title')
			).toHaveTextContent('This field is required');
		});
	});

	describe('edge cases', () => {
		test('shows uppercase validation error for invalid value input', async () => {
			const user = userEvent.setup();
			renderWithProvider();

			await user.type(screen.getByLabelText('Title'), 'Euro');
			await user.type(screen.getByLabelText('Value'), 'usd');

			const form = screen.getByTestId('settings-currency-form');
			await act(async () => {
				fireEvent.submit(form);
			});

			expect(
				screen.getByTestId('settings-currency-error-value')
			).toHaveTextContent('Value must contain only uppercase Latin letters');
		});
	});
});
