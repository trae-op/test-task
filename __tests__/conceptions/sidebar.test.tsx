import { render, screen } from '@testing-library/react';
import React from 'react';

import { Sidebar } from '@/app/_conceptions/Sidebar/Sidebar';
import { NavItem } from '@/app/_conceptions/Sidebar/SidebarNavItem/NavItem';

jest.mock('@/context/global/useContext', () => ({
	useAvatarProfileSelector: () => 'https://example.com/avatar.png'
}));

describe('Sidebar and NavItem', () => {
	it('NavItem toggles active class (positive)', () => {
		render(<NavItem text='Dashboard' isActive />);
		const el = screen.getByText('Dashboard');
		expect(el).toBeInTheDocument();
	});

	it('Sidebar renders profile and items (positive)', () => {
		render(
			<Sidebar
				items={[
					{ href: '/orders', label: 'orders' },
					{ href: '/products', label: 'products' }
				]}
			/>
		);
		expect(screen.getByRole('img', { name: /ava/i })).toBeInTheDocument();
		expect(screen.getByText('orders')).toBeInTheDocument();
		expect(screen.getByText('products')).toBeInTheDocument();
	});

	it('Sidebar handles empty items (negative)', () => {
		render(<Sidebar items={[]} />);
		expect(screen.getByRole('img', { name: /ava/i })).toBeInTheDocument();
	});
});
