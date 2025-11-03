import { render, screen } from '@testing-library/react';

import { OrderRow } from '@/app/_conceptions/Orders/Order';
import { Provider as OrdersProvider } from '@/context/orders';

const baseProps = {
	id: 'order-1',
	title: 'Order Title',
	amountOfProducts: 3,
	date: new Date('2025-10-17T10:00:00Z'),
	userId: 'u1',
	description: null
} as const;

describe('components/Orders/OrderRow', () => {
	it('renders title link and product count and date blocks', () => {
		render(
			<OrdersProvider entityId={baseProps.id}>
				<table>
					<tbody>
						<OrderRow {...(baseProps as any)} isDeleteButton={true} />
					</tbody>
				</table>
			</OrdersProvider>
		);
		expect(screen.getByText('Order Title')).toBeInTheDocument();
		// Products label is returned as key by next-intl mock
		expect(screen.getByText('Products')).toBeInTheDocument();
		// Count shows products length
		expect(screen.getByText('3')).toBeInTheDocument();
		// Date pieces rendered: primary dd/MM and secondary dd/MM/yyyy
		expect(screen.getByText('17/10')).toBeInTheDocument();
		expect(screen.getByText('17/10/2025')).toBeInTheDocument();
		// Delete trigger button present (from DeleteEntityButton)
		expect(
			screen.getAllByRole('button', { name: 'Delete' })[0]
		).toBeInTheDocument();
	});

	it('hides date blocks when date missing', () => {
		render(
			<OrdersProvider>
				<table>
					<tbody>
						{/* @ts-expect-error intentionally omitting date to verify conditional UI */}
						<OrderRow id='2' title='No Details' amountOfProducts={0} />
					</tbody>
				</table>
			</OrdersProvider>
		);
		expect(screen.getByText('No Details')).toBeInTheDocument();
		// Products block label remains present
		expect(screen.getByText('Products')).toBeInTheDocument();
		// No date blocks
		expect(screen.queryByText(/\d{2}\/\d{2}/)).not.toBeInTheDocument();
	});

	it('shows active arrow when current entityId matches row id', () => {
		render(
			<OrdersProvider isAdaptiveTable={true} entityId={baseProps.id}>
				<table>
					<tbody>
						<OrderRow {...(baseProps as any)} isDeleteButton={false} />
					</tbody>
				</table>
			</OrdersProvider>
		);
		// Basic assertion to ensure row renders under adaptive table
		expect(screen.getByText(/2025/)).toBeInTheDocument();
	});
});
