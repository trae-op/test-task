import { render, screen } from '@testing-library/react';

import { TProductData } from '@/types/product';

import { ProductsTable } from '@/app/_conceptions/Products/Products';

const items: TProductData[] = [
	{
		id: 'p1',
		title: 'Prod1',
		serialNumber: 'SN1',
		isNew: 1,
		price: [{ value: 10, symbol: 'USD', isDefault: 1 }]
	},
	{
		id: 'p2',
		title: 'Prod2',
		serialNumber: 'SN2',
		isNew: 0,
		price: [{ value: 20, symbol: 'USD', isDefault: 1 }]
	}
];

describe('components/Products', () => {
	it('returns null for empty items', () => {
		const { container } = render(<ProductsTable items={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders table rows for items', () => {
		render(<ProductsTable items={items} />);
		expect(screen.getAllByRole('row')).toHaveLength(2);
	});
});
