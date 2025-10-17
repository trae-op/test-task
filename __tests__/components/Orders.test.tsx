import { render, screen } from '@testing-library/react';

import { OrderTable } from '@/components/Orders/Orders';

import { TOrderData } from '@/types/order';

const items: TOrderData[] = [
	{
		id: '1',
		title: 'First',
		products: ['a', 'b'],
		date: new Date('2025-10-17T10:00:00Z')
	},
	{
		id: '2',
		title: 'Second',
		products: [],
		date: new Date('2025-10-18T10:00:00Z')
	}
];

describe('components/Orders', () => {
	it('returns null for empty items', () => {
		const { container } = render(<OrderTable items={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders table rows for items', () => {
		render(<OrderTable items={items} />);
		expect(screen.getAllByRole('row')).toHaveLength(2);
	});
});
