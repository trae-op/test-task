import { render, screen } from '@testing-library/react';

import { ProductState } from '@/app/_conceptions/Products/State';

describe('components/Products/State', () => {
	it('renders NEW (available) state when isNew=true', () => {
		render(<ProductState isNew={true} />);
		// next-intl mock returns key strings 'available'/'inRepair'
		expect(screen.getByText('available')).toBeInTheDocument();
	});

	it('renders USED (inRepair) state when isNew=false', () => {
		render(<ProductState isNew={false} />);
		expect(screen.getByText('inRepair')).toBeInTheDocument();
	});
});
