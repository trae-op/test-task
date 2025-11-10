import { TErrorCodes } from '@/types/errorCodes';

type TGuaranteeDate = string | null;

export type TAddProductInput = {
	title: string;
	type?: string | null;
	specification?: string | null;
	guaranteeStart?: TGuaranteeDate;
	guaranteeEnd?: TGuaranteeDate;
	orderId?: string | null;
	isNew?: boolean;
	prices: Array<{ symbol: 'USD' | 'UAH'; value: number; isDefault?: boolean }>;
};

export type TAddProductResult =
	| { ok: true; id: string }
	| {
			ok: false;
			code: TErrorCodes;
	  };

export type TAddProductSubmitState = { ok: boolean; message?: string };
