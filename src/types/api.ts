import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { NextApiResponse } from 'next';
import type { Server as SocketServer } from 'socket.io';

export type TNextApiResponse = NextApiResponse & {
	socket: Socket & {
		server: HTTPServer & {
			io?: SocketServer;
		};
	};
};

export type TGlobalThis = typeof globalThis & {
	activeSessions?: number;
};
