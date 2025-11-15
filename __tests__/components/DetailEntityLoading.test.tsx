import { render, screen } from '@testing-library/react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';

describe('DetailEntityLoading', () => {
	test('renders loading placeholders container', () => {
		render(<DetailEntityLoading />);

		const container = screen.getByTestId('detail-entity-loading');
		expect(container).toBeInTheDocument();
	});
});
