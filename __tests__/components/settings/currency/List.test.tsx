import { render, screen } from '@testing-library/react';
import React from 'react';

import { CurrencyList } from '@/app/_conceptions/Settings/components/Currency/List';

jest.mock('@/context/currency/useContext', () => ({
	useListSelector: () => [
		{ id: 'c1', title: 'US Dollar', value: 'USD' },
		{ id: 'c2', title: 'Euro', value: 'EUR' }
	]
}));

jest.mock('@/app/_conceptions/Settings/Currency/DeleteButton', () => ({
	DeleteButton: ({ entityId }: any) => <button>Delete {entityId}</button>
}));

describe('components/settings/currency/CurrencyList', () => {
	it('renders list items with delete buttons', () => {
		render(<CurrencyList />);
		expect(screen.getByText(/US Dollar/)).toBeInTheDocument();
		expect(screen.getByText(/Euro/)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Delete c1' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Delete c2' })
		).toBeInTheDocument();
	});
});
