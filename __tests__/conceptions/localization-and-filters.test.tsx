import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FilterProducts } from '@/app/_conceptions/FilterProducts/FilterProducts';
import { FilterProductsWrapper } from '@/app/_conceptions/FilterProducts/FilterProductsWrapper';
import { LocalizationDropdown } from '@/app/_conceptions/LocalizationDropdown/LocalizationDropdown';

jest.mock('next-intl', () => ({
	useLocale: () => 'en',
	useTranslations: () => (k: string) => k
}));

const pushSpy = jest.fn();
// Override next/navigation to control hooks
jest.mock('next/navigation', () => ({
	usePathname: () => '/en/products',
	useSearchParams: () => new URLSearchParams('type='),
	useRouter: () => ({ push: pushSpy, refresh: jest.fn() })
}));

describe('LocalizationDropdown', () => {
	it('shows current locale and language options (positive)', () => {
		render(<LocalizationDropdown />);
		const toggle = screen.getByRole('button', { name: /EN/i });
		expect(toggle).toBeInTheDocument();
		// Open the dropdown to render menu items
		fireEvent.click(toggle);
		expect(screen.getByText('en')).toBeInTheDocument();
		expect(screen.getByText('uk')).toBeInTheDocument();
	});
});

describe('FilterProducts and Wrapper', () => {
	it('renders on products path and triggers change (positive)', () => {
		render(<FilterProducts />);
		const select = screen.getByRole('combobox');
		fireEvent.change(select, { target: { value: 'phone' } });
		expect(pushSpy).toHaveBeenCalled();
	});

	it('Wrapper hides outside products path (negative)', () => {
		jest.resetModules();
		jest.doMock('next/navigation', () => ({ usePathname: () => '/en/orders' }));
		const {
			FilterProductsWrapper: Wrapper
		} = require('@/app/_conceptions/FilterProducts/FilterProductsWrapper');
		const { container } = render(<Wrapper />);
		expect(container).toBeEmptyDOMElement();
	});
});
