import { render, screen } from '@testing-library/react';

import { ProductState } from '@/app/_conceptions/Products/State';

describe('components/Products/State', () => {
	it('renders NEW (available) state when isNew=1', () => {
		render(<ProductState isNew={1} />);
		// next-intl mock returns key strings 'available'/'inRepair'
		expect(screen.getByText('available')).toBeInTheDocument();
	});

	it('renders USED (inRepair) state when isNew=0', () => {
		render(<ProductState isNew={0} />);
		expect(screen.getByText('inRepair')).toBeInTheDocument();
	});
});
