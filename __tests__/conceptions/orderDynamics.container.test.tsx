import { render, screen } from '@testing-library/react';
import React from 'react';

import { Container } from '@/app/_conceptions/OrderDynamics';

const setTitle = jest.fn();
const setTotal = jest.fn();
const setLink = jest.fn();

jest.mock('next-intl', () => ({
	useLocale: () => 'en',
	useTranslations: () => (key: string) => key
}));

jest.mock('react-chartjs-2', () => ({
	Bar: () => <div data-testid='bar-chart-mock' />
}));

jest.mock('@/context/global/useContext', () => ({
	useEntitiesTitleDispatch: () => setTitle,
	useSetEntitiesTotalDispatch: () => setTotal,
	useSetLinkAddEntityDispatch: () => setLink
}));

jest.mock('@/utils/routing', () => ({
	getAddOrderHref: () => '/orders/add'
}));

describe('OrderDynamics Container', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should set global values on mount', () => {
		render(<Container orders={[]} />);
		expect(setTitle).toHaveBeenCalledWith('Order Dynamics');
		expect(setTotal).toHaveBeenCalledWith(0);
		expect(setLink).toHaveBeenCalled();
	});

	it('should update total when orders length changes', () => {
		const { rerender } = render(<Container orders={[]} />);
		expect(setTotal).toHaveBeenLastCalledWith(0);
		const orders = [
			{ date: '2024-01-01T00:00:00.000Z', amountOfProducts: 1, prices: [] }
		];
		rerender(<Container orders={orders as any} />);
		expect(setTotal).toHaveBeenLastCalledWith(1);
	});

	it('should render chart child', () => {
		render(<Container orders={[]} />);
		expect(screen.getByText(/No orders available/i)).toBeInTheDocument();
	});
});
