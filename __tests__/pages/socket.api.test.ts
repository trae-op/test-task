import type { NextApiRequest } from 'next';

import handler from '@/pages/api/socket';
import type { TNextApiResponse } from '@/pages/api/types';

const ioInstances: Array<{ on: jest.Mock; emit: jest.Mock }> = [];

const ServerMock = jest.fn(() => {
	const instance = {
		on: jest.fn(),
		emit: jest.fn()
	};
	ioInstances.push(instance);
	return instance;
});

jest.mock('socket.io', () => ({
	Server: function ServerReplacement(...args: Parameters<typeof ServerMock>) {
		return ServerMock(...args);
	}
}));

type TMockResult = {
	res: TNextApiResponse;
	status: jest.Mock;
	json: jest.Mock;
};

const createResponse = (server: Record<string, unknown> = {}): TMockResult => {
	const json = jest.fn();
	const status = jest.fn(() => ({ json }));
	return {
		res: {
			status,
			socket: {
				server
			}
		} as unknown as TNextApiResponse,
		status,
		json
	};
};

type TMockClient = {
	on: jest.Mock;
	emit: jest.Mock;
	trigger: (event: string) => void;
};

const getConnectionHandler = ():
	| ((client: TMockClient) => void)
	| undefined => {
	const instance = ioInstances[ioInstances.length - 1];
	if (!instance) return undefined;
	const call = instance.on.mock.calls.find(([event]) => event === 'connection');
	return call?.[1] as ((client: TMockClient) => void) | undefined;
};

const createSocketClient = (): TMockClient => {
	const listeners: Record<string, () => void> = {};
	const client: TMockClient = {
		on: jest.fn((event: string, handler: () => void) => {
			listeners[event] = handler;
			return client;
		}),
		emit: jest.fn(),
		trigger: (event: string) => listeners[event]?.()
	};
	return client;
};

describe('socket api handler', () => {
	beforeEach(() => {
		ioInstances.length = 0;
		ServerMock.mockClear();
		const globalWithSessions = globalThis as { activeSessions?: number };
		delete globalWithSessions.activeSessions;
	});

	it('initializes Socket.io server once and attaches to http server', () => {
		const server: Record<string, unknown> = {};
		const { res, status, json } = createResponse(server);

		handler({} as NextApiRequest, res);

		expect(ServerMock).toHaveBeenCalledTimes(1);
		expect(ServerMock).toHaveBeenCalledWith(
			server,
			expect.objectContaining({ path: '/api/socket' })
		);
		expect(res.socket.server.io).toBe(ioInstances[0]);
		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith({ ok: true });

		handler({} as NextApiRequest, res);
		expect(ServerMock).toHaveBeenCalledTimes(1);
	});

	it('tracks active sessions through connection lifecycle', () => {
		const server: Record<string, unknown> = {};
		const { res } = createResponse(server);

		handler({} as NextApiRequest, res);

		const connectionHandler = getConnectionHandler();
		expect(connectionHandler).toBeDefined();
		const client = createSocketClient();

		connectionHandler?.(client);

		const globalWithSessions = globalThis as { activeSessions?: number };
		expect(globalWithSessions.activeSessions).toBe(1);
		expect(ioInstances[0].emit).toHaveBeenLastCalledWith('activeSessions', 1);
		expect(client.emit).toHaveBeenLastCalledWith('activeSessions', 1);

		client.trigger('disconnect');
		expect(globalWithSessions.activeSessions).toBe(0);
		expect(ioInstances[0].emit).toHaveBeenLastCalledWith('activeSessions', 0);
	});
});
