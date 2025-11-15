import { render, screen } from '@testing-library/react';

import { Price } from '@/components/Price';

describe('Price', () => {
	test('renders dash when no prices and no adaptive table', () => {
		render(<Price prices={[]} hasAdaptiveTable={false} />);

		const dash = screen.getByText('-');
		expect(dash).toBeInTheDocument();
	});

	test('renders nothing when no prices and hasAdaptiveTable is true', () => {
		const { container } = render(<Price prices={[]} hasAdaptiveTable={true} />);

		expect(container.firstChild).toBeNull();
	});

	test('renders default and non-default prices', () => {
		const prices = [
			{ symbol: 'USD', value: 10, isDefault: true },
			{ symbol: 'EUR', value: 9, isDefault: false }
		];

		render(<Price prices={prices} hasAdaptiveTable={false} />);

		expect(screen.getByText('10 USD')).toBeInTheDocument();
		expect(screen.getByText('9 EUR')).toBeInTheDocument();
	});
});
