import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import { CircleActionButton } from '@/components/CircleActionButton';

type IconProps = {
	className?: string;
	size?: number;
};

const TestIcon = ({ className }: IconProps): ReactElement => (
	<span data-testid='circle-action-icon' className={className}>
		icon
	</span>
);

describe('CircleActionButton', () => {
	test('renders icon and children', () => {
		const text = 'Do action';

		render(
			<CircleActionButton
				Icon={TestIcon}
				ariaLabelText='action'
				data-testid='circle-action-btn'
			>
				{text}
			</CircleActionButton>
		);

		const button = screen.getByTestId('circle-action-btn');
		expect(button).toBeInTheDocument();
		expect(screen.getByTestId('circle-action-icon')).toBeInTheDocument();
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	test('fires click handler', () => {
		const handleClick = jest.fn();

		render(
			<CircleActionButton
				Icon={TestIcon}
				ariaLabelText='action'
				data-testid='circle-action-btn'
				onClick={handleClick}
			>
				Action
			</CircleActionButton>
		);

		fireEvent.click(screen.getByTestId('circle-action-btn'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
