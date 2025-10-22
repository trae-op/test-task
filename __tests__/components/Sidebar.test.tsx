import { render, screen } from '@testing-library/react';

import { Sidebar } from '@/app/_conceptions/Sidebar/Sidebar';

describe('components/Sidebar', () => {
	it('renders nav items', () => {
		render(
			<Sidebar
				items={[
					{ href: '/orders', label: 'orders' },
					{ href: '/products', label: 'products' }
				]}
			/>
		);
		// useTranslations mock returns key string itself
		expect(screen.getByText('orders')).toBeInTheDocument();
		expect(screen.getByText('products')).toBeInTheDocument();
	});
});
