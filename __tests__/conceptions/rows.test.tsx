import { render, screen } from '@testing-library/react';
import React from 'react';

import { OrderRow } from '@/app/_conceptions/Orders/components/Order';
import { ProductRow } from '@/app/_conceptions/Products/components/Product';

type TProductRowProps = React.ComponentProps<typeof ProductRow>;

jest.mock('@/utils/dateTime', () => ({ formatDateTime: () => '01 Jan, 2024' }));
jest.mock('@/context/products/useContext', () => ({
	useAdaptiveTableSelector: () => false
}));
jest.mock('@/context/orders/useContext', () => ({
	useAdaptiveTableSelector: () => false,
	useEntityIdSelector: () => null
}));
jest.mock('@/app/_conceptions/DeleteProducts/DeleteEntity', () => ({
	DeleteEntity: () => null
}));
jest.mock('@/app/_conceptions/DeleteOrder/DeleteEntity', () => ({
	DeleteEntity: () => null
}));

describe('Row components', () => {
	it('ProductRow renders update link (positive)', () => {
		render(
			<table>
				<tbody>
					<ProductRow
						id={'p1'}
						title={'Phone'}
						serialNumber={'SN'}
						isNew={true}
						prices={[]}
						type={'phone'}
						photo={null as any}
						specification={null as any}
						guaranteeStart={null as any}
						guaranteeEnd={null as any}
						date={null as any}
						orderId={null as any}
						userId={'u1' as any}
					/>
				</tbody>
			</table>
		);
		const links = screen.getAllByRole('link');
		expect(links.length).toBeGreaterThan(0);
	});

	it('OrderRow renders update/details links (positive)', () => {
		render(
			<table>
				<tbody>
					<OrderRow
						id={'o1'}
						title={'Order'}
						prices={[]}
						amountOfProducts={0}
						date={new Date()}
						userId={'u1' as any}
						description={null as any}
					/>
				</tbody>
			</table>
		);
		expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
	});

	it('ProductRow does not crash without optional props (negative)', () => {
		render(
			<table>
				<tbody>
					<ProductRow
						{...({
							id: 'p2',
							title: 'X',
							serialNumber: 'S'
						} as unknown as TProductRowProps)}
					/>
				</tbody>
			</table>
		);
		expect(true).toBe(true);
	});
});
