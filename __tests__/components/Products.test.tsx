import { render, screen } from '@testing-library/react';

import { ProductsTable } from '@/app/_conceptions/Products/Products';
import { Provider as ProductsProvider } from '@/context/products';

const items = [
	{
		id: 'p1',
		title: 'Prod1',
		serialNumber: 'SN1',
		isNew: true,
		prices: [{ value: 10, symbol: 'USD', isDefault: true }]
	},
	{
		id: 'p2',
		title: 'Prod2',
		serialNumber: 'SN2',
		isNew: false,
		prices: [{ value: 20, symbol: 'USD', isDefault: true }]
	}
] as const;

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
				<ProductsTable items={items as any} />
			</ProductsProvider>
		);
		expect(screen.getAllByRole('row')).toHaveLength(2);
	});
});
