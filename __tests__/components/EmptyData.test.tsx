import { render, screen } from '@testing-library/react';

import { EmptyData } from '@/components/EmptyData';

describe('EmptyData', () => {
	test('renders card with default translated text', () => {
		render(<EmptyData text='No data available' />);

		const title = screen.getByText('No data');
		expect(title).toBeInTheDocument();
		const body = screen.getByText('No data available');
		expect(body).toBeInTheDocument();
	});

	test('renders card with custom text key', () => {
		render(<EmptyData text='Custom empty text' />);

		const body = screen.getByText('Custom empty text');
		expect(body).toBeInTheDocument();
	});
});
