import type { Order } from '@prisma/client';

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
};

export type TOrderActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TOrder[];
};
