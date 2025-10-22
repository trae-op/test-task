import { render, screen } from '@testing-library/react';

import { NavItem } from '@/app/_conceptions/Sidebar/SidebarNavItem/NavItem';

describe('components/Sidebar/NavItem', () => {
	it('renders active state', () => {
		render(<NavItem isActive text='Orders' />);
		const el = screen.getByText('Orders');
		expect(el.className).toMatch(/nav-item--active/);
	});

	it('renders inactive state', () => {
		render(<NavItem isActive={false} text='Products' />);
		const el = screen.getByText('Products');
		expect(el.className).not.toMatch(/nav-item--active/);
	});
});
