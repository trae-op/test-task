import { fireEvent, render, screen } from '@testing-library/react';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';

describe('DeleteEntityButton', () => {
	test('renders default trash icon when no children provided', () => {
		render(
			<DeleteEntityButton
				data-testid='delete-entity-button'
				aria-label='Delete'
			/>
		);

		const button = screen.getByTestId('delete-entity-button');
		expect(button).toBeInTheDocument();
	});

	test('renders custom children and preserves aria-label', () => {
		const text = 'Remove';

		render(
			<DeleteEntityButton
				data-testid='delete-entity-button'
				aria-label='Remove'
			>
				{text}
			</DeleteEntityButton>
		);

		const button = screen.getByTestId('delete-entity-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Remove');
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	test('fires click handler when clicked', () => {
		const handleClick = jest.fn();

		render(
			<DeleteEntityButton
				data-testid='delete-entity-button'
				aria-label='Delete'
				onClick={handleClick}
			/>
		);

		fireEvent.click(screen.getByTestId('delete-entity-button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
