import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { DeleteButton } from '@/app/_conceptions/Settings/Currency/DeleteButton';

const deleteEntityMock = jest.fn();
jest.mock('@/hooks/settings/currency', () => ({
	useActions: () => ({ deleteEntity: deleteEntityMock })
}));

let itemsMock: any[] = [];
let deleteLoading = false;
jest.mock('@/context/currency/useContext', () => ({
	useListSelector: () => itemsMock,
	useDeleteLoadingSelector: () => deleteLoading
}));

// Mock Button to render minimal structure while preserving behavior
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

describe('components/settings/currency/DeleteButton', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		itemsMock = [{ id: 'c1' }];
		deleteLoading = false;
	});

	it('returns null when no items', () => {
		itemsMock = [];
		const { container } = render(<DeleteButton entityId='c1' />);
		expect(container).toBeEmptyDOMElement();
	});

	it('calls deleteEntity on click', () => {
		render(<DeleteButton entityId='c1' />);
		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
		expect(deleteEntityMock).toHaveBeenCalledWith({ id: 'c1' });
	});

	it('shows loading and disables when delete pending for this id', () => {
		const { rerender } = render(<DeleteButton entityId='c1' />);
		// first click sets internal id state
		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
		// emulate pending
		deleteLoading = true;
		// re-render with same props to pick up new selector value
		rerender(<DeleteButton entityId='c1' />);
		expect(screen.getByRole('button')).toBeDisabled();
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
