import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

function immediateModal({ children }: { children: React.ReactNode }) {
	return <div role='dialog'>{children}</div>;
}

jest.mock('react-bootstrap/Modal', () => immediateModal);

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

		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		const footer = (await screen.findByText('Cancel')).closest(
			'div'
		) as HTMLElement;
		const btn = within(footer).getByRole('button', { name: /^Apply$/i });
		fireEvent.click(btn);
		expect(onApply).toHaveBeenCalled();
	});
});
