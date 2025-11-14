import type { TProductType } from '@/types/productType';

export type TAddProductTypeInput = {
	title: string;
	value: string;
};

export type TAddProductTypeResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'SERVER_ERROR';
	item?: TProductType;
};

export type TAddProductTypeSubmitState = {
	ok: boolean;
	message?: string;
	item?: TProductType;
};

export type TDeleteProductTypeState = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'ID_NOT_FOUND' | 'NOT_FOUND' | 'SERVER_ERROR';
};
