import { fireEvent, render, screen } from '@testing-library/react';

import { CloseEntityButton } from '@/components/CloseEntityButton';

describe('CloseEntityButton', () => {
	test('renders button with NavigationLink inside', () => {
		render(
			<CloseEntityButton
				data-testid='close-entity-button'
				ariaLabelText='close'
				href='/test'
			/>
		);

		const button = screen.getByTestId('close-entity-button');
		expect(button).toBeInTheDocument();
	});

	test('fires onClick handler when clicked', () => {
		const handleClick = jest.fn();

		render(
			<CloseEntityButton
				data-testid='close-entity-button'
				ariaLabelText='close'
				onClick={handleClick}
			/>
		);

		fireEvent.click(screen.getByTestId('close-entity-button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
