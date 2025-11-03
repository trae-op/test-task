import { render, screen } from '@testing-library/react';

import { OrderTable } from '@/app/_conceptions/Orders';
import { Provider as OrdersProvider } from '@/context/orders';

const items = [
	{
		id: '1',
		title: 'First',
		amountOfProducts: 2,
		date: new Date('2025-10-17T10:00:00Z'),
		description: null,
		userId: 'u1'
	},
	{
		id: '2',
		title: 'Second',
		amountOfProducts: 0,
		date: new Date('2025-10-18T10:00:00Z'),
		description: null,
		userId: 'u1'
	}
] as const;

describe('components/Orders', () => {
	it('shows empty state for empty items', () => {
		render(
			<OrdersProvider>
				<OrderTable items={[]} />
			</OrdersProvider>
		);
		expect(screen.getByText('No orders available')).toBeInTheDocument();
	});

	it('renders table rows for items', () => {
		render(
			<OrdersProvider>
				<OrderTable items={items as any} />
			</OrdersProvider>
		);
		expect(screen.getAllByRole('row')).toHaveLength(2);
	});
});
