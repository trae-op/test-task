'use client';

import { createContext, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import type {
	TActiveSessionsStatus,
	TContext,
	TProviderProps,
	TSubscriberCallback
} from './types';

const SOCKET_PATH = '/api/socket';

const parseCount = (payload: unknown): number => {
	if (typeof payload === 'number') {
		return payload;
	}

	if (typeof payload === 'object' && payload !== null && 'count' in payload) {
		const value = (payload as { count?: unknown }).count;

		if (typeof value === 'number') {
			return value;
		}
	}

	return 0;
};

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
	const count = useRef<number>(0);
	const status = useRef<TActiveSessionsStatus>('connecting');
	const socketRef = useRef<SocketIOClient.Socket | undefined>(undefined);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const notify = useCallback(() => {
		subscribers.current.forEach(callback => callback());
	}, []);

	const getCount = useCallback(() => count.current, []);
	const getStatus = useCallback(() => status.current, []);

	const subscribe = useCallback((callback: TSubscriberCallback) => {
		subscribers.current.add(callback);
		return () => {
			subscribers.current.delete(callback);
		};
	}, []);

	const setCount = useCallback(
		(value: number) => {
			count.current = value;
			notify();
		},
		[notify]
	);

	const setStatus = useCallback(
		(value: TActiveSessionsStatus) => {
			status.current = value;
			notify();
		},
		[notify]
	);

	useEffect(() => {
		let isMounted = true;

		const initialize = async () => {
			setStatus('connecting');

			try {
				await fetch(SOCKET_PATH);

				if (!isMounted) {
					return;
				}

				const socket = io({
					path: SOCKET_PATH,
					transports: ['websocket']
				});

				socketRef.current = socket;

				socket.on('connect', () => {
					if (!isMounted) {
						return;
					}

					setStatus('connected');
				});

				socket.on('activeSessions', (payload: unknown) => {
					if (!isMounted) {
						return;
					}

					setCount(parseCount(payload));
				});

				socket.on('disconnect', () => {
					if (!isMounted) {
						return;
					}

					setStatus('idle');
				});

				socket.on('connect_error', () => {
					if (!isMounted) {
						return;
					}

					setStatus('error');
				});

				socket.on('error', () => {
					if (!isMounted) {
						return;
					}

					setStatus('error');
				});
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setStatus('error');
			}
		};

		initialize();

		return () => {
			isMounted = false;
			socketRef.current?.off('activeSessions');
			socketRef.current?.disconnect();
			socketRef.current = undefined;
			count.current = 0;
			status.current = 'idle';
		};
	}, [setCount, setStatus]);

	return (
		<Context.Provider value={{ getCount, getStatus, subscribe }}>
			{children}
		</Context.Provider>
	);
}
