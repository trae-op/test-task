import { render, screen } from '@testing-library/react';
import React from 'react';

import { CurrencyContainer } from '@/app/_conceptions/Settings/components/Currency/Container';

jest.mock('@/app/_conceptions/Settings/Currency/List', () => ({
	CurrencyList: () => <div data-testid='currency-list' />
}));

jest.mock('@/app/_conceptions/Settings/Currency/Form', () => ({
	FormCurrency: () => <div data-testid='currency-form' />
}));

describe('components/settings/currency/Container', () => {
	it('renders list and form inside form provider', () => {
		render(<CurrencyContainer />);
		expect(screen.getByTestId('currency-list')).toBeInTheDocument();
		expect(screen.getByTestId('currency-form')).toBeInTheDocument();
	});
});
