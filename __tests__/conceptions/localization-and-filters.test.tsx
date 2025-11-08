import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { FilterProducts } from '@/app/_conceptions/FilterProducts/FilterProducts';
import { FilterProductsWrapper } from '@/app/_conceptions/FilterProducts/FilterProductsWrapper';
import { LocalizationDropdown } from '@/app/_conceptions/LocalizationDropdown/LocalizationDropdown';

jest.mock('@/context/global/useContext', () => ({
	useProductTypesSelector: () => [
		{ value: 'phone', title: 'phone' },
		{ value: 'laptop', title: 'laptop' }
	]
}));

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
	it('shows current locale and language options (positive)', async () => {
		render(<LocalizationDropdown />);
		const toggle = screen.getByRole('button', { name: /EN/i });
		expect(toggle).toBeInTheDocument();
		// Open the dropdown to render menu items
		const user = userEvent.setup();
		await user.click(toggle);
		expect(await screen.findByText('en')).toBeInTheDocument();
		expect(await screen.findByText('uk')).toBeInTheDocument();
	});
});

describe('FilterProducts and Wrapper', () => {
	it('renders on products path and triggers change (positive)', async () => {
		render(<FilterProducts />);
		const select = screen.getByRole('combobox');
		const user = userEvent.setup();
		await user.selectOptions(select, 'phone');
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
