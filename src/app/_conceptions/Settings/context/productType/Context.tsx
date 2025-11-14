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
	const state = useRef<TEntity[]>(items || []);
	const loading = useRef(true);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const get = useCallback((): TEntity[] => state.current, []);

	const isLoading = useCallback((): boolean => loading.current, []);

	const setListLoading = useCallback((value: boolean): void => {
		loading.current = value;
		subscribers.current.forEach(cb => cb());
	}, []);

	const setAll = useCallback((values: TEntity[]): void => {
		state.current = values;
		subscribers.current.forEach(cb => cb());
	}, []);

	const subscribe = useCallback((callback: () => void) => {
		subscribers.current.add(callback);
		return (): void => {
			subscribers.current.delete(callback);
		};
	}, []);

	const remove = (id: string) => {
		state.current = state.current.filter(data => data.id !== id);
		subscribers.current.forEach(cb => cb());
	};

	return (
		<Context.Provider
			value={{
				get,
				subscribe,
				remove,
				setAll,
				isLoading,
				setListLoading
			}}
		>
			{children}
		</Context.Provider>
	);
}
