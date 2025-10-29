'use client';

import { createContext, useCallback, useRef } from 'react';

import type { TContext, TProviderProps, TSubscriberCallback } from './types';

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
	const title = useRef('');
	const total = useRef(0);
	const linkAddEntity = useRef('');
	const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

	const getEntitiesTitle = useCallback((): string | undefined => {
		return title.current;
	}, []);

	const getLinkAddEntity = useCallback((): string | undefined => {
		return linkAddEntity.current;
	}, []);

	const getEntitiesTotal = useCallback((): number | undefined => {
		return total.current;
	}, []);

	const setEntitiesTitle = useCallback((value: string): void => {
		title.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const setLinkAddEntity = useCallback((value: string): void => {
		linkAddEntity.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const setEntitiesTotal = useCallback((value: number): void => {
		total.current = value;
		subscribers.current.forEach(callback => callback());
	}, []);

	const subscribe = useCallback((callback: () => void) => {
		subscribers.current.add(callback);

		return (): void => {
			subscribers.current.delete(callback);
		};
	}, []);

	return (
		<Context.Provider
			value={{
				getLinkAddEntity,
				setLinkAddEntity,
				setEntitiesTitle,
				setEntitiesTotal,
				getEntitiesTitle,
				getEntitiesTotal,
				subscribe
			}}
		>
			{children}
		</Context.Provider>
	);
}
