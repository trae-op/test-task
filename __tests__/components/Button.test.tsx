import { fireEvent, render, screen } from '@testing-library/react';
import { type ReactElement } from 'react';

import { Button } from '@/components/Button';

type IconComponentProps = {
	className?: string;
	size?: number;
};

const IconComponent = ({ className }: IconComponentProps): ReactElement => (
	<span data-testid='button-icon' className={className}>
		icon
	</span>
);

describe('Button', () => {
	test('renders text and children when not loading', () => {
		const text = 'Click me';
		const childText = ' child';

		render(
			<Button data-testid='base-button' text={text}>
				{childText}
			</Button>
		);

		const button = screen.getByTestId('base-button');
		expect(button).toBeInTheDocument();
		expect(screen.getByText(text + childText)).toBeInTheDocument();
	});

	test('renders loading spinner when isLoading is true', () => {
		render(<Button data-testid='base-button' text='Loading' isLoading />);

		const button = screen.getByTestId('base-button');
		expect(button).toBeInTheDocument();
		expect(button.querySelector('.spinner-border')).not.toBeNull();
	});

	test('renders icon component when IconComponent is provided', () => {
		render(
			<Button
				data-testid='base-button'
				text='With icon'
				IconComponent={IconComponent}
				iconClassName='custom-icon-class'
			/>
		);

		const icon = screen.getByTestId('button-icon');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass('custom-icon-class');
	});

	test('calls onClick handler when button is clicked', () => {
		const handleClick = jest.fn();

		render(
			<Button
				data-testid='base-button'
				text='Clickable'
				onClick={handleClick}
			/>
		);

		fireEvent.click(screen.getByTestId('base-button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
