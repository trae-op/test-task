import { render, screen } from '@testing-library/react';

import { ProductPrice } from '@/components/Products/Price';

describe('components/Products/Price', () => {
	it('renders default and non-default prices with proper classes', () => {
		render(
			<ProductPrice
				price={[
					{ value: 200, symbol: 'USD', isDefault: 1 },
					{ value: 7600, symbol: 'UAH', isDefault: 0 }
				]}
			/>
		);
		// default price exists
		expect(screen.getByText(/200/)).toBeInTheDocument();
		// non-default has a special class
		const uah = screen.getByText(/7600/);
		expect(uah.className).toMatch(/price-not-default/);
	});
});
