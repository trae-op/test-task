import { render, screen } from '@testing-library/react';
import React from 'react';

import { ProductsTable } from '@/app/_conceptions/Products/Products';
import { ProductState } from '@/app/_conceptions/Products/State';

jest.mock('@/context/products/useContext', () => ({
	useListSelector: () => [
		{
			id: 'p1',
			title: 'Phone',
			serialNumber: 'SN123',
			isNew: true,
			type: 'phone',
			guaranteeStart: null,
			guaranteeEnd: null
		}
	],
	useAdaptiveTableSelector: () => false
}));

jest.mock('@/utils/dateTime', () => ({
	formatDateTime: () => '01 Jan, 2024'
}));

const NoOpDeleteProductEntity = () => null;

jest.mock('@/app/_conceptions/DeleteProducts/DeleteEntity', () => ({
	DeleteEntity: NoOpDeleteProductEntity
}));

describe('Products components', () => {
	it('ProductsTable renders list (positive)', () => {
		render(<ProductsTable />);
		expect(screen.getByRole('table')).toBeInTheDocument();
	});

	it('ProductsTable shows empty state (negative)', () => {
		render(<ProductsTable items={[]} />);
		expect(
			screen.getByText(/Could not find any products/i)
		).toBeInTheDocument();
	});

	it('ProductState shows available/used states', () => {
		const { rerender } = render(<ProductState isNew={true} />);
		expect(screen.getByText('Available')).toBeInTheDocument();
		rerender(<ProductState isNew={false} />);
		expect(screen.getByText('Not available')).toBeInTheDocument();
	});
});
