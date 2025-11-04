import { fireEvent, render, screen, within } from '@testing-library/react';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

// Mock react-bootstrap/Modal to render children immediately
jest.mock('react-bootstrap/Modal', () => {
	return ({ children }: any) => <div role='dialog'>{children}</div>;
});

// Force popup hook to report open state after clicking by default
jest.mock('@/hooks/popup', () => ({
	usePopup: () => ({
		isOpen: true,
		handleOpen: jest.fn(),
		handleClose: jest.fn()
	})
}));

describe('components/Popup', () => {
	it('opens and invokes popup handler', async () => {
		const onApply = jest.fn();
		render(
			<Popup
				title='popup?'
				componentButton={DeleteEntityButton}
				onApply={onApply}
			/>
		);

		// click trigger (DeleteEntityButton)
		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		// wait for modal content then click popup button inside the modal footer
		const footer = (await screen.findByText('Cancel')).closest(
			'div'
		) as HTMLElement;
		const btn = within(footer).getByRole('button', { name: /^Apply$/i });
		fireEvent.click(btn);
		expect(onApply).toHaveBeenCalled();
	});
});
