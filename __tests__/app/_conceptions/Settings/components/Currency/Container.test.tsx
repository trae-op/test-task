import { render, screen } from '@testing-library/react';

import { CurrencyContainer } from '@/app/_conceptions/Settings/components/Currency/Container';

jest.mock('@/app/_conceptions/Settings/components/Currency/Form', () => ({
	FormCurrency: () => <div data-testid='settings-currency-form-stub' />
}));

describe('CurrencyContainer', () => {
	test('renders form within provider', () => {
		render(<CurrencyContainer />);

		expect(
			screen.getByTestId('settings-currency-form-stub')
		).toBeInTheDocument();
	});
});
