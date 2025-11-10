import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const addProductSubmitSpy = jest.fn();
const addOrderSubmitSpy = jest.fn();

jest.mock('@/hooks/addProduct', () => ({
	useAddProductActions: () => ({
		onAddProductSubmit: addProductSubmitSpy,
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('@/hooks/addProduct/useActions', () => ({
	useAddProductActions: () => ({
		onAddProductSubmit: addProductSubmitSpy,
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('@/hooks/addOrder', () => ({
	useAddOrderActions: () => ({
		onAddOrderSubmit: addOrderSubmitSpy,
		state: { message: '' },
		isPending: false
	})
}));

jest.mock('next/navigation', () => ({ useParams: () => ({ locale: 'en' }) }));

describe('Add forms', () => {
	it('AddProduct negative: shows validation error on empty submit', async () => {
		const { Container } = require('@/app/_conceptions/AddProduct/Container');
		render(<Container />);
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /Submit/i }));
		expect(addProductSubmitSpy).not.toHaveBeenCalled();
		expect(await screen.findAllByText('required')).not.toHaveLength(0);
	});

	it('AddOrder negative: shows validation error on empty submit', async () => {
		const { AddOrder } = require('@/app/_conceptions/AddOrder/AddOrder');
		render(<AddOrder products={[]} />);
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /Submit/i }));
		expect(addOrderSubmitSpy).not.toHaveBeenCalled();
		expect(await screen.findAllByText('required')).not.toHaveLength(0);
	});
});
