import { render, screen } from '@testing-library/react';

import { AddContent } from '@/components/AddContent';

describe('components/AddContent', () => {
	it('renders title and total value and button', () => {
		render(<AddContent title='Products' totalValue={3} />);
		expect(screen.getByLabelText('add content')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
