import { render, screen } from '@testing-library/react';

import { ProductsTable } from '@/app/_conceptions/Products/Products';
import type { TEntity as TProductEntity } from '@/app/_conceptions/Products/types';
import { Provider as ProductsProvider } from '@/context/products';

const items: TProductEntity[] = [
	{
		id: 'p1',
		title: 'Prod1',
		serialNumber: 'SN1',
		isNew: true,
		photo: null,
		type: null,
		specification: null,
		guaranteeStart: null,
		guaranteeEnd: null,
		date: null,
		orderId: null,
		userId: 'u1',
		prices: [
			{
				id: 'pr-1',
				userId: 'u1',
				productId: 'p1',
				value: 10,
				symbol: 'USD',
				isDefault: true
			}
		]
	},
	{
		id: 'p2',
		title: 'Prod2',
		serialNumber: 'SN2',
		isNew: false,
		photo: null,
		type: null,
		specification: null,
		guaranteeStart: null,
		guaranteeEnd: null,
		date: null,
		orderId: null,
		userId: 'u1',
		prices: [
			{
				id: 'pr-2',
				userId: 'u1',
				productId: 'p2',
				value: 20,
				symbol: 'USD',
				isDefault: true
			}
		]
	}
];

describe('components/Products', () => {
	it('shows empty state for empty items', () => {
		render(
			<ProductsProvider>
				<ProductsTable items={[]} />
			</ProductsProvider>
		);
		expect(screen.getByText('Could not find any products')).toBeInTheDocument();
	});

	it('renders table rows for items', () => {
		render(
			<ProductsProvider>
				<ProductsTable items={items} />
			</ProductsProvider>
		);
		expect(screen.getAllByRole('row')).toHaveLength(2);
	});
});
