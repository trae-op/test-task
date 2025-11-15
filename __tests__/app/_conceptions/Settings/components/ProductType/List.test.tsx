import { render, screen } from '@testing-library/react';

import { ProductTypeList } from '@/app/_conceptions/Settings/components/ProductType/List';
import { useListSelector } from '@/app/_conceptions/Settings/context/productType/useContext';

jest.mock('@/app/_conceptions/Settings/context/productType/useContext', () => ({
	useListSelector: jest.fn()
}));

jest.mock(
	'@/app/_conceptions/Settings/components/ProductType/DeleteButton',
	() => ({
		DeleteButton: ({ entityId }: { entityId: string }) => (
			<button data-testid={`settings-product-type-delete-${entityId}`}>
				Delete
			</button>
		)
	})
);

describe('ProductTypeList', () => {
	beforeEach(() => {
		(useListSelector as jest.Mock).mockReset();
	});

	describe('positive cases', () => {
		test('renders product type rows', () => {
			(useListSelector as jest.Mock).mockReturnValue([
				{ id: '1', title: 'Accessory', value: 'accessory' },
				{ id: '2', title: 'Device', value: 'device' }
			]);

			render(<ProductTypeList />);

			expect(
				screen.getByTestId('settings-product-type-list')
			).toBeInTheDocument();
			expect(
				screen.getByTestId('settings-product-type-item-2')
			).toHaveTextContent('Device (device)');
		});
	});

	describe('negative cases', () => {
		test('returns null when no items provided', () => {
			(useListSelector as jest.Mock).mockReturnValue([]);

			const { container } = render(<ProductTypeList />);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe('edge cases', () => {
		test('returns null when selector undefined', () => {
			(useListSelector as jest.Mock).mockReturnValue(undefined);

			const { container } = render(<ProductTypeList />);
			expect(container).toBeEmptyDOMElement();
		});
	});
});
