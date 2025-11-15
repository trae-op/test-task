import { render, screen } from '@testing-library/react';

import { ProductTypeContainer } from '@/app/_conceptions/Settings/components/ProductType/Container';

jest.mock('@/app/_conceptions/Settings/components/ProductType/Form', () => ({
	FormProductType: () => <div data-testid='settings-product-type-form-stub' />
}));

describe('ProductTypeContainer', () => {
	test('renders form provider content', () => {
		render(<ProductTypeContainer />);
		expect(
			screen.getByTestId('settings-product-type-form-stub')
		).toBeInTheDocument();
	});
});
