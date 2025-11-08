import type { Order, OrderLocation } from '@prisma/client';

import type { TErrorCodes } from './errorCodes';
import type { TProduct } from './products';

export type TOrderPriceSummary = {
	value: number;
	symbol: string;
	isDefault?: boolean | null;
};

export type TOrder = Order & {
	amountOfProducts?: number | null;
	products?: TProduct[];
	prices?: TOrderPriceSummary[];
	location?: OrderLocation | null;
};

export type TOrderActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TOrder[];
};
