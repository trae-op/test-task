import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { DeleteButton } from '@/app/_conceptions/Settings/ProductType/DeleteButton';

const deleteEntityMock = jest.fn();
jest.mock('@/hooks/settings/productType', () => ({
	useActions: () => ({ deleteEntity: deleteEntityMock })
}));

let itemsMock: any[] = [];
let deleteLoading = false;
jest.mock('@/context/productType/useContext', () => ({
	useListSelector: () => itemsMock,
	useDeleteLoadingSelector: () => deleteLoading
}));

jest.mock('@/components/Button', () => ({
	Button: (props: any) => {
		const { isLoading, text, onClick, disabled } = props;
		return (
			<button onClick={onClick} disabled={disabled}>
				{isLoading ? <span role='status' /> : text}
			</button>
		);
	}
}));

describe('components/settings/productType/DeleteButton', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		itemsMock = [{ id: 't1' }];
		deleteLoading = false;
	});

	it('returns null when no items', () => {
		itemsMock = [];
		const { container } = render(<DeleteButton entityId='t1' />);
		expect(container).toBeEmptyDOMElement();
	});

	it('calls deleteEntity on click', () => {
		render(<DeleteButton entityId='t1' />);
		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
		expect(deleteEntityMock).toHaveBeenCalledWith({ id: 't1' });
	});

	it('shows loading and disables when delete pending for this id', () => {
		const { rerender } = render(<DeleteButton entityId='t1' />);
		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
		deleteLoading = true;
		rerender(<DeleteButton entityId='t1' />);
		expect(screen.getByRole('button')).toBeDisabled();
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
