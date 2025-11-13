import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';

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
