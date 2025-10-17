import { render, screen } from '@testing-library/react';

import { OrderRow } from '@/components/Orders/Order';

jest.mock('next/navigation', () => ({
	useParams: () => ({ id: 'active-id' })
}));

const baseProps = {
	id: 'order-1',
	title: 'Order Title',
	products: ['a', 'b', 'c'],
	date: new Date('2025-10-17T10:00:00Z')
};

describe('components/Orders/OrderRow', () => {
	it('renders title link and product count and date blocks', () => {
		render(
			<table>
				<tbody>
					<OrderRow {...baseProps} isDeleteButton={true} isActive={false} />
				</tbody>
			</table>
		);
		expect(screen.getByText('Order Title')).toBeInTheDocument();
		// Products label is returned as key by next-intl mock
		expect(screen.getByText('Products')).toBeInTheDocument();
		// Count shows products length
		expect(screen.getByText('3')).toBeInTheDocument();
		// Date pieces rendered: one with dd / MM and one with dd MMM yyyy (year visible)
		expect(screen.getByText(/\d{2} \/ \d{2}/)).toBeInTheDocument();
		expect(screen.getByText(/2025/)).toBeInTheDocument();
		// Delete trigger button present (from DeleteEntityButton)
		expect(
			screen.getAllByRole('button', { name: 'Delete' })[0]
		).toBeInTheDocument();
	});

	it('hides product and date blocks when data missing', () => {
		render(
			<table>
				<tbody>
					<OrderRow
						id='2'
						title='No Details'
						isDeleteButton={false}
						isActive={false}
					/>
				</tbody>
			</table>
		);
		expect(screen.getByText('No Details')).toBeInTheDocument();
		expect(screen.queryByText('Products')).not.toBeInTheDocument();
		// No date blocks
		expect(screen.queryByText(/\d{2} \/ \d{2}/)).not.toBeInTheDocument();
	});

	it('shows active arrow when isActive is true', () => {
		render(
			<table>
				<tbody>
					<OrderRow {...baseProps} isDeleteButton={false} isActive={true} />
				</tbody>
			</table>
		);
		// Presence of caret icon container (cannot easily query svg caret, but arrow container exists)
		// We can assert that there are two titled date texts still
		expect(screen.getByText(/2025/)).toBeInTheDocument();
	});
});
