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
	const loading = useRef<boolean>(true);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const notify = useCallback(() => {
		subscribers.current.forEach(callback => callback());
	}, []);

	const get = useCallback((): TEntity[] => state.current, []);

	const isLoading = useCallback((): boolean => loading.current, []);

	const setListLoading = useCallback(
		(value: boolean) => {
			loading.current = value;
			notify();
		},
		[notify]
	);

	const setAll = useCallback(
		(entities: TEntity[]) => {
			state.current = entities;
			notify();
		},
		[notify]
	);

	const subscribe = useCallback((callback: TSubscriberCallback) => {
		subscribers.current.add(callback);
		return () => {
			subscribers.current.delete(callback);
		};
	}, []);

	return (
		<Context.Provider
			value={{ get, setAll, setListLoading, subscribe, isLoading }}
		>
			{children}
		</Context.Provider>
	);
};
