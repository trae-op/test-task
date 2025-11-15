import { render, screen } from '@testing-library/react';

import { TProduct } from '@/types/products';

import { ProductsTable } from '@/app/_conceptions/Products/components/Products';
import { Provider } from '@/app/_conceptions/Products/context/Context';

jest.mock('@/components/EmptyData/EmptyData', () => ({
	EmptyData: jest.fn(() => <div data-testid='empty-data'>empty</div>)
}));

jest.mock('@/app/_conceptions/Products/components/Product', () => ({
	ProductRow: ({ id }: { id: string }) => (
		<tr data-testid='product-row'>
			<td>{id}</td>
		</tr>
	)
}));

describe('ProductsTable', () => {
	test('renders EmptyData when no items in props or context', () => {
		render(
			<Provider items={[]}>
				<ProductsTable isDeleteButton={false} />
			</Provider>
		);

		expect(screen.getByTestId('empty-data')).toBeInTheDocument();
	});

	test('renders rows from props when provided', () => {
		const items: TProduct[] = [
			{
				id: 'p1',
				serialNumber: 'SN-001',
				isNew: false,
				photo: null,
				title: 'Product One',
				type: null,
				specification: null,
				guaranteeStart: null,
				guaranteeEnd: null,
				date: null,
				orderId: null,
				userId: 'u1',
				prices: [
					{
						symbol: 'USD',
						id: 'pr1',
						userId: 'u1',
						value: 100,
						isDefault: true,
						productId: 'p1'
					}
				]
			},
			{
				id: 'p2',
				serialNumber: 'SN-002',
				isNew: true,
				photo: null,
				title: 'Product Two',
				type: null,
				specification: null,
				guaranteeStart: null,
				guaranteeEnd: null,
				date: null,
				orderId: null,
				userId: 'u1',
				prices: [
					{
						symbol: 'USD',
						id: 'pr2',
						userId: 'u1',
						value: 200,
						isDefault: false,
						productId: 'p2'
					}
				]
			}
		];

		render(
			<Provider items={items}>
				<ProductsTable isDeleteButton={false} />
			</Provider>
		);

		const rows = screen.getAllByTestId('product-row');
		expect(rows).toHaveLength(2);
	});
});
