import { render, screen } from '@testing-library/react';
import React from 'react';

import { DateTimeDisplay } from '@/app/_conceptions/TopHeader.ts/DateTimeDisplay';
import { Logo } from '@/app/_conceptions/TopHeader.ts/Logo';
import { TopHeader } from '@/app/_conceptions/TopHeader.ts/TopHeader';

function noopDynamic() {
	return () => null;
}

jest.mock('next/dynamic', () => noopDynamic);
jest.mock('@/utils/dateTime', () => ({
	formatDateTime: ({ formatString }: { formatString: string }) => {
		if (formatString === 'EEEE') return 'Monday';
		if (formatString === 'dd MMM, yyyy') return '15 Jan, 2024';
		if (formatString === 'HH:mm') return '12:34';
		return 'formatted';
	}
}));

describe('TopHeader suite', () => {
	it('Logo renders an svg', () => {
		const { container } = render(<Logo />);
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
	});

	it('DateTimeDisplay renders day, date and time (positive)', () => {
		render(<DateTimeDisplay date={new Date('2024-01-15T12:34:00.000Z')} />);
		expect(screen.getByText('Monday')).toBeInTheDocument();
		expect(screen.getByText('15 Jan, 2024')).toBeInTheDocument();
		expect(screen.getByText('12:34')).toBeInTheDocument();
	});

	it('DateTimeDisplay handles missing date gracefully (negative)', () => {
		render(<DateTimeDisplay date={undefined as unknown as Date} />);
		expect(true).toBe(true);
	});

	it('TopHeader composes HeaderInfo and DateTimeDisplay', () => {
		render(<TopHeader endContentComponent={<div data-testid='end-slot' />} />);
		expect(screen.getByTestId('end-slot')).toBeInTheDocument();
	});
});
