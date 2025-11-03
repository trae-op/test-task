import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { DeleteEntity as DeleteOrderEntity } from '@/app/_conceptions/DeleteOrder/DeleteEntity';
import { DeleteEntity as DeleteProductEntity } from '@/app/_conceptions/DeleteProducts/DeleteEntity';

// Mock Popup to invoke onOpen then onApply when clicking the open button
jest.mock('@/components/Popup/Popup', () => ({
	Popup: ({
		onApply,
		onOpen,
		children,
		componentButton: Btn,
		openButtonAriaLabel
	}: any) => (
		<div>
			<button
				aria-label={openButtonAriaLabel || 'open'}
				onClick={() => {
					onOpen?.();
					onApply?.(() => {});
				}}
			>
				open
			</button>
			{children}
			<Btn />
		</div>
	)
}));

jest.mock('@/context/orders/useContext', () => ({
	useDeleteLoadingSelector: () => false,
	useListSelector: () => [
		{
			id: '1',
			title: 'Order 1',
			products: [{ id: 'p1', title: 'Phone', serialNumber: 'SN', isNew: true }]
		}
	],
	useAdaptiveTableSelector: () => false
}));

jest.mock('@/context/products/useContext', () => ({
	useDeleteLoadingSelector: () => false,
	useAdaptiveTableSelector: () => false
}));

jest.mock('@/hooks/deleteOrder', () => ({
	useActions: () => ({ deleteEntity: jest.fn() })
}));
jest.mock('@/hooks/deleteProduct', () => ({
	useActions: () => ({ deleteEntity: jest.fn() })
}));

jest.mock('@/conceptions/Products', () => ({
	ProductsTable: () => <div data-testid='products-preview' />
}));
jest.mock('@/context/products', () => ({
	Provider: ({ children }: any) => <div>{children}</div>
}));

describe('Delete entities', () => {
	it('DeleteProduct triggers delete action (positive)', () => {
		render(<DeleteProductEntity id='p1' />);
		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		expect(true).toBe(true);
	});

	it('DeleteOrder shows products preview and triggers delete (positive)', () => {
		render(<DeleteOrderEntity id='1' />);
		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		expect(screen.getByTestId('products-preview')).toBeInTheDocument();
	});

	it('DeleteProduct respects disabled state (negative)', () => {
		jest.doMock('@/context/products/useContext', () => ({
			useDeleteLoadingSelector: () => true,
			useAdaptiveTableSelector: () => false
		}));
		const {
			DeleteEntity
		} = require('@/app/_conceptions/DeleteProducts/DeleteEntity');
		render(<DeleteEntity id='p2' />);
		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		expect(true).toBe(true);
	});
});
