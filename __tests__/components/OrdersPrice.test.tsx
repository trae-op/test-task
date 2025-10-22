import { render, screen } from '@testing-library/react';

import { OrderPrice } from '@/app/_conceptions/Orders/Price';

describe('components/Orders/Price', () => {
	it('renders default and non-default prices with proper classes', () => {
		render(
			<OrderPrice
				price={[
					{ value: 100, symbol: 'USD', isDefault: 1 },
					{ value: 3800, symbol: 'UAH', isDefault: 0 }
				]}
			/>
		);
		// default price exists
		expect(screen.getByText(/100/)).toBeInTheDocument();
		// non-default has a special class
		const uah = screen.getByText(/3800/);
		expect(uah.className).toMatch(/price-not-default/);
	});
});
