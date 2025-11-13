import type { Server as HTTPServer } from 'http';
import type { NextApiRequest } from 'next';
import { Server } from 'socket.io';

import { TGlobalThis, TNextApiResponse } from './types';

export const config = {
	api: {
		bodyParser: false
	}
};

const global = globalThis as TGlobalThis;

if (global.activeSessions === undefined) {
	global.activeSessions = 0;
}

const handler = (_req: NextApiRequest, res: TNextApiResponse) => {
	const { socket } = res;
	const server = socket.server;
	const serverIO = server as HTTPServer & { io?: Server };

	if (!serverIO.io) {
		const io = new Server(serverIO, {
			path: '/api/socket',
			serveClient: false,
			cors: {
				origin: '*'
			}
		});

		serverIO.io = io;

		io.on('connection', socketClient => {
			global.activeSessions = (global.activeSessions ?? 0) + 1;

			io.emit('activeSessions', global.activeSessions);

			socketClient.on('disconnect', () => {
				global.activeSessions = Math.max(0, (global.activeSessions ?? 1) - 1);

				io.emit('activeSessions', global.activeSessions);
			});

			socketClient.emit('activeSessions', global.activeSessions);
		});
	}

	res.status(200).json({ ok: true });
};

export default handler;
