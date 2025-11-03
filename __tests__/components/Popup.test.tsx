import { fireEvent, render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

describe('components/Popup', () => {
	it('opens and invokes popup handler', () => {
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
		// click popup button inside the modal footer
		const footer = screen.getByText('Cancel').closest('div') as HTMLElement;
		const btn = within(footer).getByRole('button', { name: /^Apply$/i });
		fireEvent.click(btn);
		expect(onApply).toHaveBeenCalled();
	});
});
