import { render, screen } from '@testing-library/react';
import React from 'react';

import { OrderDynamicsChart } from '@/app/_conceptions/OrderDynamics/OrderDynamics';

jest.mock('next-intl', () => ({
	useLocale: () => 'en',
	useTranslations: () => (key: string) => key
}));

jest.mock('react-chartjs-2', () => ({
	Bar: ({ data }: { data: unknown }) => (
		<div data-testid='bar-chart'>chart {JSON.stringify(data)}</div>
	)
}));

// Ensure dynamic import resolves to the mocked Bar immediately
jest.mock('next/dynamic', () => ({
	__esModule: true,
	default: () => {
		const { Bar } = require('react-chartjs-2');
		return Bar;
	}
}));

describe('OrderDynamicsChart', () => {
	it('should show empty state when no orders', () => {
		render(<OrderDynamicsChart orders={[]} />);
		expect(screen.getByText(/No orders available/i)).toBeInTheDocument();
	});

	it('should render chart when orders provided', () => {
		const orders = [
			{
				date: '2024-01-10T00:00:00.000Z',
				amountOfProducts: 2,
				prices: [{ value: 5, symbol: 'USD', isDefault: true }]
			},
			{
				date: '2024-02-05T00:00:00.000Z',
				amountOfProducts: 1,
				prices: [{ value: 3, symbol: 'USD', isDefault: true }]
			}
		];
		render(<OrderDynamicsChart orders={orders as any} />);
		expect(screen.queryByText(/No orders available/i)).not.toBeInTheDocument();
		expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
		expect(screen.getByTestId('bar-chart').textContent).toMatch(/Orders/);
		expect(screen.getByTestId('bar-chart').textContent).toMatch(/Products/);
		expect(screen.getByTestId('bar-chart').textContent).toMatch(/USD Amount/);
	});
});
