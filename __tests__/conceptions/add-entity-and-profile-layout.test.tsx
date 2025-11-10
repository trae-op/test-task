import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/context/global/useContext', () => ({
	useEntitiesTotalSelector: () => 5,
	useLinkAddEntitySelector: () => '/orders',
	useEntitiesTitleDispatch: () => jest.fn(),
	useSetEntitiesTotalDispatch: () => jest.fn(),
	useSetLinkAddEntityDispatch: () => jest.fn(),
	useEntitiesTitleSelector: () => 'Receipts'
}));

jest.mock('next/navigation', () => ({
	usePathname: () => '/en/dashboard',
	useParams: () => ({})
}));

const PlainNavigationLink = ({ href, children }: any) => (
	<a href={href}>{children}</a>
);

jest.mock('@/components/NavigationLink', () => ({
	NavigationLink: PlainNavigationLink
}));

describe('AddEntity wrapper', () => {
	it('renders title and total (positive)', () => {
		jest.resetModules();
		const { AddEntity } = require('@/app/_conceptions/AddEntity/AddEntity');
		render(<AddEntity />);
		expect(screen.getByText('Receipts')).toBeInTheDocument();
		expect(screen.getByText('/')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('hides on new/add routes (negative)', () => {
		jest.resetModules();
		jest.doMock('next/navigation', () => ({
			usePathname: () => '/en/products/new',
			useParams: () => ({})
		}));
		const { AddEntity } = require('@/app/_conceptions/AddEntity/AddEntity');
		const { container } = render(<AddEntity />);
		expect(container).toBeEmptyDOMElement();
	});
});
