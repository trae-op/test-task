import { render, screen } from '@testing-library/react';
import React from 'react';

import { ProductTypeList } from '@/app/_conceptions/Settings/ProductType/List';

jest.mock('@/context/productType/useContext', () => ({
	useListSelector: () => [
		{ id: 't1', title: 'Hardware', value: 'hw' },
		{ id: 't2', title: 'Software', value: 'sw' }
	]
}));

jest.mock('@/app/_conceptions/Settings/ProductType/DeleteButton', () => ({
	DeleteButton: ({ entityId }: any) => <button>Delete {entityId}</button>
}));

describe('components/settings/productType/ProductTypeList', () => {
	it('renders list items with delete buttons', () => {
		render(<ProductTypeList />);
		expect(screen.getByText(/Hardware/)).toBeInTheDocument();
		expect(screen.getByText(/Software/)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Delete t1' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Delete t2' })
		).toBeInTheDocument();
	});
});
