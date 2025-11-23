import type { TCurrency } from '@/types/currency';
import { TErrorCodes } from '@/types/errorCodes';

export type TAddCurrencyInput = {
	title: string;
	value: string;
};

export type TAddCurrencyResult = {
	ok: boolean;
	code?: TErrorCodes;
	item?: TCurrency;
};

export type TAddCurrencySubmitState = {
	ok: boolean;
	message?: string;
	item?: TCurrency;
};

export type TDeleteCurrencyState = {
	ok: boolean;
	code?: TErrorCodes;
};
