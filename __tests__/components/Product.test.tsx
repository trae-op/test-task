import { render, screen } from '@testing-library/react';

import type { TProductData } from '@/types/product';

import { ProductRow } from '@/app/_conceptions/Products/Product';

const base = {
	id: 'p1',
	title: 'Phone',
	serialNumber: 'SN-001',
	isNew: 1,
	guarantee: {
		start: new Date('2025-10-01T00:00:00Z'),
		end: new Date('2026-10-01T00:00:00Z')
	},
	price: [
		{ value: 100, symbol: 'USD', isDefault: 1 },
		{ value: 3800, symbol: 'UAH', isDefault: 0 }
	]
} satisfies TProductData;

describe('components/Products/ProductRow', () => {
	it('renders title, serial, state, guarantee and prices', () => {
		render(
			<table>
				<tbody>
					<ProductRow {...base} />
				</tbody>
			</table>
		);
		expect(screen.getByText('Phone')).toBeInTheDocument();
		expect(screen.getByText('SN-001')).toBeInTheDocument();
		// price values
		expect(screen.getByText(/100/)).toBeInTheDocument();
		expect(screen.getByText(/3800/)).toBeInTheDocument();
		// Guarantee labels and years are present (next-intl mock returns keys 'from'/'to')
		expect(screen.getByText('from')).toBeInTheDocument();
		expect(screen.getByText('to')).toBeInTheDocument();
		// at least two year stamps rendered
		expect(screen.getAllByText(/\b\d{4}\b/).length).toBeGreaterThanOrEqual(2);
	});

	it('handles missing optional fields', () => {
		render(
			<table>
				<tbody>
					<ProductRow id='x' title='T' serialNumber='Y' />
				</tbody>
			</table>
		);
		expect(screen.getByText('T')).toBeInTheDocument();
		expect(screen.getByText('Y')).toBeInTheDocument();
	});
});
