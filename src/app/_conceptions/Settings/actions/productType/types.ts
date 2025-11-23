import { TErrorCodes } from '@/types/errorCodes';
import type { TProductType } from '@/types/productType';

export type TAddProductTypeInput = {
	title: string;
	value: string;
};

export type TAddProductTypeResult = {
	ok: boolean;
	code?: TErrorCodes;
	item?: TProductType;
};

export type TAddProductTypeSubmitState = {
	ok: boolean;
	message?: string;
	item?: TProductType;
};

export type TDeleteProductTypeState = {
	ok: boolean;
	code?: TErrorCodes;
};
