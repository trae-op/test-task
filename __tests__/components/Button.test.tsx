import { render, screen } from '@testing-library/react';
import { Plus } from 'react-bootstrap-icons';

import { Button } from '@/components/ui/Button/Button';

describe('components/ui/Button', () => {
	it('renders text', () => {
		render(<Button text='Click me' />);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		render(<Button text='Add' IconComponent={Plus} />);
		expect(screen.getByText('Add')).toBeInTheDocument();
	});
});
