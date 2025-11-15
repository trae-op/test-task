import { render, screen } from '@testing-library/react';

import { EmptyData } from '@/components/EmptyData';

import { OrderTable } from '@/app/_conceptions/Orders/components/Orders';
import { Provider } from '@/app/_conceptions/Orders/context/Context';
import type { TEntity } from '@/app/_conceptions/Orders/context/types';

jest.mock('@/components/EmptyData', () => ({
	EmptyData: ({ text }: { text: string }) => (
		<div data-testid='orders-empty'>{text}</div>
	)
}));

jest.mock('@/app/_conceptions/Orders/components/Order', () => ({
	OrderRow: ({ id }: { id: string }) => (
		<tr>
			<td data-testid={`order-row-${id}`}>Order {id}</td>
		</tr>
	)
}));

describe('OrderTable component', () => {
	test('renders EmptyData when no items are provided', () => {
		render(
			<Provider>
				<OrderTable isDeleteButton isUpdateButton items={[]} />
			</Provider>
		);

		expect(screen.getByTestId('orders-empty')).toHaveTextContent(
			'No orders available'
		);
	});

	test('renders rows for provided items', () => {
		const items: TEntity[] = [
			{
				id: '1',
				title: 'Order 2',
				date: new Date('2020-01-01'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			},
			{
				id: '2',
				title: 'Order 2',
				date: new Date('2020-01-02'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			}
		];

		render(
			<Provider>
				<OrderTable isDeleteButton isUpdateButton items={items} />
			</Provider>
		);

		expect(screen.getByTestId('order-row-1')).toBeInTheDocument();
		expect(screen.getByTestId('order-row-2')).toBeInTheDocument();
	});
});
