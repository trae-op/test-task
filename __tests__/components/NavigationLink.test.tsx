import { render, screen } from '@testing-library/react';

import { NavigationLink } from '@/components/ui/NavigationLink';

const Dummy = ({ isActive, text }: { isActive: boolean; text?: string }) => (
	<span data-testid='nav-item' data-active={isActive}>
		{text}
	</span>
);

describe('components/NavigationLink', () => {
	it('renders text when no component is provided', () => {
		render(<NavigationLink href='/' text='Home' />);
		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('renders custom component with active flag', () => {
		render(<NavigationLink href='/' text='Home' component={Dummy} />);
		const item = screen.getByTestId('nav-item');
		expect(item).toHaveAttribute('data-active', 'true');
		expect(item).toHaveTextContent('Home');
	});
});
