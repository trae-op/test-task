'use client';

import { createContext, useCallback, useRef } from 'react';

import type {
	TContext,
	TEntity,
	TProviderProps,
	TSubscriberCallback
} from './types';

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
	const state = useRef<TEntity[]>([]);
	const loading = useRef(true);
	const deleteLoading = useRef(false);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const get = useCallback((): TEntity[] => {
		return state.current;
	}, []);

	const isLoading = useCallback((): boolean => {
		return loading.current;
	}, []);

	const isDeleteLoading = useCallback((): boolean => {
		return deleteLoading.current;
	}, []);

	const setDeleteLoading = useCallback((loadingState: boolean): void => {
		deleteLoading.current = loadingState;
		subscribers.current.forEach(callback => callback());
	}, []);

	const setListLoading = useCallback((loadingState: boolean): void => {
		loading.current = loadingState;
		subscribers.current.forEach(callback => callback());
	}, []);

	const amountEntities = useCallback((): number => {
		return state.current.length;
	}, []);

	const setAll = useCallback((items: TEntity[]): void => {
		state.current = items;
		subscribers.current.forEach(callback => callback());
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
		<Context.Provider
			value={{
				get,
				subscribe,
				remove,
				setDeleteLoading,
				isDeleteLoading,
				setAll,
				amountEntities,
				isLoading,
				setListLoading
			}}
		>
			{children}
		</Context.Provider>
	);
}
