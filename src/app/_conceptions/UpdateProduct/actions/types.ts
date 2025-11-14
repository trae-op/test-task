import { TErrorCodes } from '@/types/errorCodes';
import type { TUpdateData } from '@/types/products';

export type TEntity = TUpdateData;

export type TPriceOption = {
	value: number;
	symbol: string;
	isDefault: boolean;
};

export type TUpdateInput = Omit<TEntity, 'prices'> & {
	prices?: TPriceOption[];
};

export type TUpdateResult = {
	ok: boolean;
	code?: TErrorCodes;
};

export type TUpdateSubmitState = { ok: boolean; message?: string };
