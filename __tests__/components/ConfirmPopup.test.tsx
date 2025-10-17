import { fireEvent, render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';

import { ConfirmPopup } from '@/components/ui/ConfirmPopup/ConfirmPopup';
import { DeleteEntityButton } from '@/components/ui/DeleteEntityButton';

describe('components/ui/ConfirmPopup', () => {
	it('opens and invokes confirm handler', () => {
		const onConfirm = jest.fn();
		render(
			<ConfirmPopup
				title='Confirm?'
				componentButton={DeleteEntityButton}
				onConfirm={onConfirm}
			/>
		);

		// click trigger (DeleteEntityButton)
		fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
		// click confirm button inside the modal footer
		const footer = screen.getByText('Cancel').closest('div') as HTMLElement;
		const confirmBtn = within(footer).getByRole('button', {
			name: /^Delete$/i
		});
		fireEvent.click(confirmBtn);
		expect(onConfirm).toHaveBeenCalled();
	});
});
