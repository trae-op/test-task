import { render, screen } from '@testing-library/react';

import { ActiveSessionsCounter } from '@/app/_conceptions/ActiveSessionsCounter/ActiveSessionsCounter';

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

const mockCountSelector = jest.fn();
const mockStatusSelector = jest.fn();

jest.mock('@/context/activeSessions', () => ({
	useActiveSessionsCountSelector: () => mockCountSelector(),
	useActiveSessionsStatusSelector: () => mockStatusSelector()
}));

describe('ActiveSessionsCounter', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders active session count when connected', () => {
		mockCountSelector.mockReturnValue(5);
		mockStatusSelector.mockReturnValue('connected');

		render(<ActiveSessionsCounter />);

		expect(screen.getByText('Active sessions: 5')).toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
		expect(screen.queryByText('Connection error')).not.toBeInTheDocument();
	});

	it('shows spinner while connecting', () => {
		mockCountSelector.mockReturnValue(0);
		mockStatusSelector.mockReturnValue('connecting');

		render(<ActiveSessionsCounter />);

		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.queryByText('Active sessions: 0')).not.toBeInTheDocument();
	});

	it('shows error message when connection fails', () => {
		mockCountSelector.mockReturnValue(0);
		mockStatusSelector.mockReturnValue('error');

		render(<ActiveSessionsCounter />);

		expect(screen.getByText('Connection error')).toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});
