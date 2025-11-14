import type { PropsWithChildren } from 'react';

export type TActiveSessionsStatus =
	| 'idle'
	| 'connecting'
	| 'connected'
	| 'error';

export type TSubscriberCallback = () => void;

export type TProviderProps = PropsWithChildren;

export type TContext = {
	getCount: () => number;
	getStatus: () => TActiveSessionsStatus;
	subscribe: (callback: TSubscriberCallback) => () => void;
};
