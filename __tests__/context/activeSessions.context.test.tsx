import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import {
	Provider as ActiveSessionsProvider,
	useActiveSessionsContext,
	useActiveSessionsCountSelector,
	useActiveSessionsStatusSelector
} from '@/context/activeSessions';

const sockets: Array<{
	on: jest.Mock;
	off: jest.Mock;
	disconnect: jest.Mock;
	trigger: (event: string, payload?: unknown) => void;
}> = [];

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const ioMock = jest.fn(() => {
	const listeners: Record<string, (payload?: unknown) => void> = {};
	const socket: {
		on: jest.Mock;
		off: jest.Mock;
		disconnect: jest.Mock;
		trigger: (event: string, payload?: unknown) => void;
	} = {
		on: jest.fn(),
		off: jest.fn(),
		disconnect: jest.fn(),
		trigger: (event: string, payload?: unknown) => {
			listeners[event]?.(payload);
		}
	};

	socket.on.mockImplementation(
		(event: string, handler: (payload?: unknown) => void) => {
			listeners[event] = handler;
			return socket;
		}
	);

	sockets.push(socket);

	return socket;
});

jest.mock('socket.io-client', () => ({
	__esModule: true,
	default: (...args: Parameters<typeof ioMock>) => ioMock(...args),
	io: (...args: Parameters<typeof ioMock>) => ioMock(...args)
}));

describe('activeSessions context', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		sockets.length = 0;
		ioMock.mockClear();
		globalThis.fetch = jest.fn(() =>
			Promise.resolve({} as Response)
		) as unknown as typeof fetch;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		if (originalFetch) {
			globalThis.fetch = originalFetch;
		} else {
			delete (globalThis as { fetch?: typeof fetch }).fetch;
		}
	});

	it('throws when selectors are used outside Provider', () => {
		expect(() => renderHook(() => useActiveSessionsContext())).toThrow(
			'useActiveSessionsContext must be used within ActiveSessions Provider'
		);
	});

	it('exposes count and status updates from socket events', async () => {
		const wrapper = ({ children }: PropsWithChildren) => (
			<ActiveSessionsProvider>{children}</ActiveSessionsProvider>
		);

		const { result } = renderHook(
			() => ({
				count: useActiveSessionsCountSelector(),
				status: useActiveSessionsStatusSelector()
			}),
			{ wrapper }
		);

		expect(result.current.status).toBe('connecting');

		await act(async () => {
			await flushPromises();
		});

		const socket = sockets[sockets.length - 1];
		expect(socket).toBeDefined();
		const currentSocket = socket!;

		await act(async () => {
			currentSocket.trigger('connect');
		});
		expect(result.current.status).toBe('connected');

		await act(async () => {
			currentSocket.trigger('activeSessions', 7);
		});
		expect(result.current.count).toBe(7);

		await act(async () => {
			currentSocket.trigger('disconnect');
		});
		expect(result.current.status).toBe('idle');

		await act(async () => {
			currentSocket.trigger('connect_error');
		});
		expect(result.current.status).toBe('error');
	});

	it('cleans up listeners on unmount', async () => {
		const wrapper = ({ children }: PropsWithChildren) => (
			<ActiveSessionsProvider>{children}</ActiveSessionsProvider>
		);

		const { unmount } = renderHook(() => useActiveSessionsCountSelector(), {
			wrapper
		});

		await act(async () => {
			await flushPromises();
		});

		const socket = sockets[sockets.length - 1];
		expect(socket).toBeDefined();
		const currentSocket = socket!;

		await act(async () => {
			unmount();
		});

		expect(currentSocket.off).toHaveBeenCalledWith('activeSessions');
		expect(currentSocket.disconnect).toHaveBeenCalledTimes(1);
	});
});
