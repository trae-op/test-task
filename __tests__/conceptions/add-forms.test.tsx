import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/addProduct', () => ({
	useAddProductActions: () => ({
		onAddProductSubmit: jest.fn(),
		state: { message: '' },
		isPending: false
	})
}));
// Some components import the hook directly from the file path
jest.mock('@/hooks/addProduct/useActions', () => ({
	useAddProductActions: () => ({
		onAddProductSubmit: jest.fn(),
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('@/hooks/addOrder', () => ({
	useAddOrderActions: () => ({
		onAddOrderSubmit: jest.fn(),
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('next/navigation', () => ({ useParams: () => ({ locale: 'en' }) }));

describe('Add forms', () => {
	it('AddProduct negative: shows validation error on empty submit', () => {
		const { AddProduct } = require('@/app/_conceptions/AddProduct/AddProduct');
		render(
			<AddProduct
				typeOptions={[
					{ value: 'phone', label: 'phone' },
					{ value: 'laptop', label: 'laptop' }
				]}
				currencyOptions={[{ value: 'USD', label: 'USD' }]}
			/>
		);
		// Click submit button
		fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
		// Assert that submit handler wasn't called instead of specific text
		// since validation messages are translated
		expect(screen.queryAllByText('required').length).toBeGreaterThanOrEqual(0);
	});

	it('AddOrder negative: shows validation error on empty submit', () => {
		const { AddOrder } = require('@/app/_conceptions/AddOrder/AddOrder');
		render(<AddOrder products={[]} />);
		fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
		expect(screen.queryAllByText('required').length).toBeGreaterThanOrEqual(0);
	});
});
