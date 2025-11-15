import { render, screen } from '@testing-library/react';

import { ActiveSessionsCounter } from '@/app/_conceptions/ActiveSessionsCounter/components/ActiveSessionsCounter';
import type { TActiveSessionsStatus } from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions/types';

let mockStatus: TActiveSessionsStatus = 'connected';
let mockCount = 0;

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

jest.mock(
	'@/app/_conceptions/ActiveSessionsCounter/context/activeSessions',
	() => ({
		useActiveSessionsCountSelector: () => mockCount,
		useActiveSessionsStatusSelector: () => mockStatus
	})
);

describe('ActiveSessionsCounter component', () => {
	beforeEach(() => {
		mockStatus = 'connected';
		mockCount = 0;
	});

	test('shows error text when status is error', () => {
		mockStatus = 'error';

		render(<ActiveSessionsCounter />);

		expect(screen.getByTestId('active-sessions-status')).toHaveTextContent(
			'Connection error'
		);
	});

	test('renders spinner while connecting', () => {
		mockStatus = 'connecting';

		render(<ActiveSessionsCounter />);

		expect(screen.getByTestId('active-sessions-spinner')).toBeInTheDocument();
	});

	test('shows translated count when connected', () => {
		mockStatus = 'connected';
		mockCount = 5;

		render(<ActiveSessionsCounter />);

		expect(screen.getByTestId('active-sessions-status')).toHaveTextContent(
			'Active sessions: 5'
		);
	});
});
