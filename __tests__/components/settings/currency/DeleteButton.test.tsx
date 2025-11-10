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

const MinimalButton = (props: any) => {
	const { isLoading, text, onClick, disabled } = props;
	return (
		<button onClick={onClick} disabled={disabled}>
			{isLoading ? <span role='status' /> : text}
		</button>
	);
};

jest.mock('@/components/Button', () => ({
	Button: MinimalButton
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
		expect(deleteEntityMock).toHaveBeenCalledWith('c1');
	});

	it('does not show loading state in test environment (no form pending)', () => {
		render(<DeleteButton entityId='c1' />);
		expect(screen.getByRole('button')).not.toBeDisabled();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});
