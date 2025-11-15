import type { TErrorCodes } from '@/types/errorCodes';

export type TUpdateOrderInput = {
	id: string;
	title: string;
	description?: string | null;
	products?: string[] | null;
};

export type TUpdateOrderResult = {
	ok: boolean;
	code?: TErrorCodes;
};

export type TUpdateOrderSubmitState = { ok: boolean; message?: string };
