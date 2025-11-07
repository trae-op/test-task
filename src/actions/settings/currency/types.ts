import type { TCurrency } from '@/types/currency';

export type TAddCurrencyInput = {
	title: string;
	value: string;
};

export type TAddCurrencyResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'SERVER_ERROR';
	item?: TCurrency;
};

export type TAddCurrencySubmitState = {
	ok: boolean;
	message?: string;
	item?: TCurrency;
};
