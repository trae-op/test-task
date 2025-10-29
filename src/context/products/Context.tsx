'use client';

import { createContext, useCallback, useRef } from 'react';

import type {
	TContext,
	TEntity,
	TProviderProps,
	TSubscriberCallback
} from './types';

export const Context = createContext<TContext | null>(null);

export function Provider({
	children,
	isAdaptiveTable = false,
	items
}: TProviderProps) {
	const state = useRef<TEntity[]>(items || []);
	const loading = useRef(true);
	const deleteLoading = useRef(false);
	const adaptiveTable = useRef(isAdaptiveTable);
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const get = useCallback((): TEntity[] => {
		return state.current;
	}, []);

	const isLoading = useCallback((): boolean => {
		return loading.current;
	}, []);

	const hasAdaptiveTable = useCallback((): boolean => {
		return adaptiveTable.current;
	}, []);

	const isDeleteLoading = useCallback((): boolean => {
		return deleteLoading.current;
	}, []);

	const setDeleteLoading = useCallback((value: boolean): void => {
		deleteLoading.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const setAdaptiveTable = useCallback((value: boolean): void => {
		adaptiveTable.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const setListLoading = useCallback((value: boolean): void => {
		loading.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const amountEntities = useCallback((): number => {
		return state.current.length;
	}, []);

	const setAll = useCallback((values: TEntity[]): void => {
		state.current = values;
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
				hasAdaptiveTable,
				setAdaptiveTable,
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
