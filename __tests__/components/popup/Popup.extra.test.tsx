import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { Popup } from '@/components/Popup/Popup';

const TriggerButton = (props: any) => (
	<button type='button' {...props}>
		Open
	</button>
);

const ApplyButton = (props: any) => (
	<button type='button' aria-label='custom-apply' {...props} />
);

const instantModal = ({ children }: { children: React.ReactNode }) => (
	<div role='dialog'>{children}</div>
);

jest.mock('react-bootstrap/Modal', () => instantModal);

jest.mock('@/hooks/popup', () => ({
	usePopup: () => ({
		isOpen: true,
		handleOpen: jest.fn(),
		handleClose: jest.fn()
	})
}));

describe('components/Popup (extra cases)', () => {
	it('renders controlled open and calls onCancel/onHide', async () => {
		const onCancel = jest.fn();
		const onHide = jest.fn();

		render(
			<Popup
				title='Title'
				componentButton={TriggerButton}
				show
				onCancel={onCancel}
				onHide={onHide}
			>
				<div>Body</div>
			</Popup>
		);

		const cancelBtn = await screen.findByRole('button', { name: /Cancel/i });
		fireEvent.click(cancelBtn);
		expect(onCancel).toHaveBeenCalled();
		expect(onHide).toHaveBeenCalled();
	});

	it('disables default Apply button when applyDisabled is true', () => {
		render(
			<Popup title='Title' componentButton={TriggerButton} show applyDisabled />
		);

		const footer = screen.getByText('Cancel').closest('div') as HTMLElement;
		const applyBtn = within(footer).getByRole('button', { name: /^Apply$/i });
		expect(applyBtn).toBeDisabled();
	});

	it('hides the Apply button when showApplyButton is false', () => {
		render(
			<Popup
				title='Title'
				componentButton={TriggerButton}
				show
				showApplyButton={false}
			/>
		);

		const footer = screen.getByText('Cancel').closest('div') as HTMLElement;
		expect(
			within(footer).queryByRole('button', { name: /^Apply$/i })
		).toBeNull();
	});

	it('uses custom ComponentApplyButton when provided', async () => {
		const onApply = jest.fn();
		render(
			<Popup
				title='Title'
				componentButton={TriggerButton}
				componentApplyButton={ApplyButton}
			/>
		);

		fireEvent.click(screen.getAllByRole('button', { name: /Open/i })[0]);
		const dialogsOpen1 = screen.getAllByRole('dialog');
		const lastDialog1 = dialogsOpen1[dialogsOpen1.length - 1];
		const customApply = within(lastDialog1).getByRole('button', {
			name: /custom-apply/i
		});
		fireEvent.click(customApply);

		render(
			<Popup
				title='Title'
				componentButton={TriggerButton}
				componentApplyButton={ApplyButton}
				onApply={onApply}
			/>
		);
		fireEvent.click(screen.getAllByRole('button', { name: /Open/i })[0]);
		const dialogsOpen2 = screen.getAllByRole('dialog');
		const lastDialog2 = dialogsOpen2[dialogsOpen2.length - 1];
		const customApply2 = within(lastDialog2).getByRole('button', {
			name: /custom-apply/i
		});
		fireEvent.click(customApply2);
		expect(onApply).toHaveBeenCalled();
	});
});
