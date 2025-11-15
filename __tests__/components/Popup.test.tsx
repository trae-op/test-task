import { act, fireEvent, render, screen } from '@testing-library/react';

import { Popup } from '@/components/Popup';

type TestButtonProps = {
	children?: React.ReactNode;
	className?: string;
	'aria-label'?: string;
	onClick?: () => void;
};

const TestButton = ({ children, ...rest }: TestButtonProps) => (
	<button type='button' data-testid='popup-open-button' {...rest}>
		{children}
	</button>
);

describe('Popup', () => {
	test('opens popup and triggers callbacks via open button', () => {
		const onOpen = jest.fn();
		const onCancel = jest.fn();
		const onHide = jest.fn();

		render(
			<Popup
				title='Confirm action'
				applyText='Apply'
				componentButton={TestButton}
				onOpen={onOpen}
				onCancel={onCancel}
				onHide={onHide}
			>
				<div data-testid='popup-body'>Body content</div>
			</Popup>
		);

		const openButton = screen.getByTestId('popup-open-button');
		fireEvent.click(openButton);

		expect(onOpen).toHaveBeenCalledTimes(1);
	});

	test('calls onApply in uncontrolled mode when apply button is clicked', () => {
		const onApply = jest.fn();

		render(
			<Popup
				title='Confirm action'
				applyText='Apply'
				componentButton={TestButton}
				onApply={onApply}
			>
				<div data-testid='popup-body'>Body content</div>
			</Popup>
		);

		fireEvent.click(screen.getByTestId('popup-open-button'));

		const applyButton = screen.getByRole('button', { name: 'Apply' });
		fireEvent.click(applyButton);

		expect(onApply).toHaveBeenCalledTimes(1);
	});
});
