import { render, screen } from '@testing-library/react';

import { DateTimeDisplay } from '@/components/TopHeader.ts/DateTimeDisplay';
import { TopHeader } from '@/components/TopHeader.ts/TopHeader';

describe('components/TopHeader', () => {
	it('renders header info and date time', () => {
		render(<TopHeader />);
		expect(screen.getByText('INVENTORY')).toBeInTheDocument();
	});

	it('DateTimeDisplay shows day/time text', () => {
		const date = new Date('2025-10-17T14:35:00Z');
		render(<DateTimeDisplay date={date} />);
		// We assert presence of some parts; exact strings depend on date-fns locale formatting
		expect(screen.getByText(/2025/)).toBeInTheDocument();
		expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
		expect(screen.getByText(/^[A-Za-z]+$/)).toBeInTheDocument();
	});
});
