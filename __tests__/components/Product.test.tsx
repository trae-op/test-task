import { render, screen } from '@testing-library/react';

import { ProductRow } from '@/app/_conceptions/Products/Product';
import { Provider as ProductsProvider } from '@/context/products';

const base = {
	id: 'p1',
	title: 'Phone',
	serialNumber: 'SN-001',
	isNew: true,
	userId: 'user-1',
	type: null,
	photo: null,
	specification: null,
	guaranteeStart: new Date('2025-10-01T00:00:00Z'),
	guaranteeEnd: new Date('2026-10-01T00:00:00Z'),
	date: null,
	orderId: null,
	prices: [
		{
			id: 'price-1',
			userId: 'user-1',
			productId: 'p1',
			value: 100,
			symbol: 'USD',
			isDefault: true
		},
		{
			id: 'price-2',
			userId: 'user-1',
			productId: 'p1',
			value: 3800,
			symbol: 'UAH',
			isDefault: false
		}
	]
};

describe('components/Products/ProductRow', () => {
	it('renders title, serial, state, guarantee and prices', () => {
		render(
			<ProductsProvider>
				<table>
					<tbody>
						<ProductRow {...base} />
					</tbody>
				</table>
			</ProductsProvider>
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
			<ProductsProvider>
				<table>
					<tbody>
						<ProductRow
							id='x'
							title='T'
							serialNumber='Y'
							isNew={false}
							userId='user-1'
							type={null}
							photo={null}
							specification={null}
							guaranteeStart={null}
							guaranteeEnd={null}
							date={null}
							orderId={null}
							prices={[]}
						/>
					</tbody>
				</table>
			</ProductsProvider>
		);
		expect(screen.getByText('T')).toBeInTheDocument();
		expect(screen.getByText('Y')).toBeInTheDocument();
	});
});
