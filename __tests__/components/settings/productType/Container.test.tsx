import { render, screen } from '@testing-library/react';
import React from 'react';

import { ProductTypeContainer } from '@/app/_conceptions/Settings/ProductType/Container';

jest.mock('@/app/_conceptions/Settings/ProductType/List', () => ({
	ProductTypeList: () => <div data-testid='pt-list' />
}));

jest.mock('@/app/_conceptions/Settings/ProductType/Form', () => ({
	FormProductType: () => <div data-testid='pt-form' />
}));

describe('components/settings/productType/Container', () => {
	it('renders list and form inside form provider', () => {
		render(<ProductTypeContainer />);
		expect(screen.getByTestId('pt-list')).toBeInTheDocument();
		expect(screen.getByTestId('pt-form')).toBeInTheDocument();
	});
});
