'use client';

import { createContext, useCallback, useRef } from 'react';

import type {
	TContext,
	TEntity,
	TProviderProps,
	TSubscriberCallback
} from './types';

export const Context = createContext<TContext | null>(null);

export function Provider({ children, items }: TProviderProps) {
	const state = useRef<TEntity[]>(items);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const get = useCallback((): TEntity[] => {
		return state.current;
	}, []);

	const subscribe = useCallback((callback: () => void) => {
		subscribers.current.add(callback);

		return (): void => {
			subscribers.current.delete(callback);
		};
	}, []);

	const remove = (id: string) => {
		state.current = state.current.filter(
			data => data.id !== undefined && data.id !== id
		);
		subscribers.current.forEach(callback => callback());
	};

	return (
		<Context.Provider value={{ get, subscribe, remove }}>
			{children}
		</Context.Provider>
	);
}
