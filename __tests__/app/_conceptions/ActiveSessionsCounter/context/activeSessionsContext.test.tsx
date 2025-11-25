import {
	act,
	render,
	renderHook,
	screen,
	waitFor
} from '@testing-library/react';
import { ReactNode } from 'react';
import io from 'socket.io-client';

import {
	Context,
	Provider
} from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions/Context';
import type { TActiveSessionsStatus } from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions/types';
import { useActiveSessionsContext } from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions/useContext';
import {
	useActiveSessionsCountSelector,
	useActiveSessionsStatusSelector
} from '@/app/_conceptions/ActiveSessionsCounter/context/activeSessions/useSelectors';

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}));

jest.mock('socket.io-client', () => ({
	__esModule: true,
	default: jest.fn()
}));

type Handlers = Record<string, ((payload?: unknown) => void) | undefined>;
type MockSocket = {
	on: jest.Mock;
	off: jest.Mock;
	disconnect: jest.Mock;
};

const mockedIo = io as jest.MockedFunction<typeof io>;
const originalFetch = global.fetch;

beforeAll(() => {
	global.fetch = jest.fn() as typeof fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

describe('ActiveSessions context hooks', () => {
	test('useActiveSessionsContext throws outside provider', () => {
		expect(() => renderHook(() => useActiveSessionsContext())).toThrow(
			'useActiveSessionsContext must be used within ActiveSessions Provider'
		);
	});

	test('useActiveSessionsContext returns provided value', () => {
		const mockValue = {
			getCount: () => 2,
			getStatus: () => 'connected' as TActiveSessionsStatus,
			subscribe: () => () => void 0
		};

		const wrapper = ({ children }: { children: ReactNode }) => (
			<Context.Provider value={mockValue}>{children}</Context.Provider>
		);

		const { result } = renderHook(() => useActiveSessionsContext(), {
			wrapper
		});

		expect(result.current).toBe(mockValue);
	});
});

describe('ActiveSessions Provider integration', () => {
	beforeEach(() => {
		(global.fetch as jest.Mock).mockResolvedValue({ ok: true });
		mockedIo.mockReset();
	});

	test('selectors react to socket events and cleanup on unmount', async () => {
		const handlers: Handlers = {};
		const mockSocket: MockSocket = {
			on: jest.fn(),
			off: jest.fn(),
			disconnect: jest.fn()
		};

		mockSocket.on.mockImplementation(
			(event: string, handler: (payload?: unknown) => void) => {
				handlers[event] = handler;
				return mockSocket;
			}
		);

		mockedIo.mockReturnValue(mockSocket as unknown as ReturnType<typeof io>);

		const Consumer = () => {
			const status = useActiveSessionsStatusSelector();
			const count = useActiveSessionsCountSelector();

			return (
				<div>
					<span data-testid='sessions-status'>{status}</span>
					<span data-testid='sessions-count'>{count}</span>
				</div>
			);
		};

		const { unmount } = render(
			<Provider>
				<Consumer />
			</Provider>
		);

		expect(screen.getByTestId('sessions-status')).toHaveTextContent(
			'connecting'
		);
		expect(screen.getByTestId('sessions-count')).toHaveTextContent('0');

		await waitFor(() => expect(mockedIo).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(handlers.activeSessions).toBeDefined());

		await act(async () => {
			handlers.connect?.();
		});

		expect(screen.getByTestId('sessions-status')).toHaveTextContent(
			'connected'
		);

		await act(async () => {
			handlers.activeSessions?.({ count: 7 });
		});

		expect(screen.getByTestId('sessions-count')).toHaveTextContent('7');

		await act(async () => {
			handlers.disconnect?.();
		});

		expect(screen.getByTestId('sessions-status')).toHaveTextContent('idle');

		await act(async () => {
			handlers.connect_error?.();
		});

		expect(screen.getByTestId('sessions-status')).toHaveTextContent('error');

		await act(async () => {
			handlers.error?.();
		});

		expect(screen.getByTestId('sessions-status')).toHaveTextContent('error');

		unmount();

		expect(mockSocket.off).toHaveBeenCalledWith('activeSessions');
		expect(mockSocket.disconnect).toHaveBeenCalled();
	});
});
