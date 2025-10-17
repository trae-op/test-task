import { render, screen } from '@testing-library/react';

import { AddEntity } from '@/components/AddEntity';

describe('components/AddEntity', () => {
	it('renders title and total value and button', () => {
		render(<AddEntity title='Products' totalValue={3} />);
		expect(screen.getByLabelText('add entity')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
