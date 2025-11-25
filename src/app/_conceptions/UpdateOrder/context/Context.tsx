'use client';

import { createContext, useCallback, useRef } from 'react';

import type {
	TContext,
	TEntity,
	TProviderProps,
	TSubscriberCallback
} from './types';

export const Context = createContext<TContext | null>(null);

export const Provider = ({ children, items }: TProviderProps) => {
	const state = useRef<TEntity[]>(items ?? []);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const get = useCallback((): TEntity[] => state.current, []);

	const subscribe = useCallback((callback: TSubscriberCallback) => {
		subscribers.current.add(callback);
		return () => {
			subscribers.current.delete(callback);
		};
	}, []);

	return (
		<Context.Provider value={{ get, subscribe }}>{children}</Context.Provider>
	);
};
