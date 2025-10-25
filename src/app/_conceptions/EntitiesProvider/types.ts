import { ReactNode } from 'react';

export type TProviderProps<T> = {
	items: T[];
	children: ReactNode;
};
