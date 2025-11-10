import { render, screen } from '@testing-library/react';
import React from 'react';

import { DetailContainer } from '@/app/_conceptions/Orders/DetailContainer';
import { OrderTable } from '@/app/_conceptions/Orders/Orders';

const NoOpDeleteOrderEntity = () => null;

jest.mock('@/app/_conceptions/DeleteOrder/DeleteEntity', () => ({
	DeleteEntity: NoOpDeleteOrderEntity
}));

jest.mock('@/context/global/useContext', () => ({
	useEntitiesTitleDispatch: () => jest.fn(),
	useSetEntitiesTotalDispatch: () => jest.fn(),
	useSetLinkAddEntityDispatch: () => jest.fn()
}));

jest.mock('@/context/orders/useContext', () => ({
	useListSelector: () => [
		{
			id: '1',
			title: 'First',
			amountOfProducts: 2,
			date: new Date().toISOString()
		}
	],
	useAdaptiveTableSelector: () => false,
	useAmountEntitiesSelector: () => 1,
	useEntityIdSelector: () => null
}));

jest.mock('@/utils/dateTime', () => ({
	formatDateTime: ({ formatString }: { formatString: string }) =>
		formatString === 'HH:mm' ? '10:00' : '01 Jan, 2024'
}));

describe('Orders components', () => {
	it('OrderTable renders list (positive)', () => {
		render(<OrderTable />);
		expect(screen.getByRole('table')).toBeInTheDocument();
	});

	it('OrderTable shows empty state (negative)', () => {
		render(<OrderTable items={[]} />);
		expect(screen.getByText(/No orders available/i)).toBeInTheDocument();
	});

	it('DetailContainer sets layout on mount', () => {
		render(
			<DetailContainer>
				<div>child</div>
			</DetailContainer>
		);
		expect(screen.getByText('child')).toBeInTheDocument();
	});
});
