import type { Order, OrderLocation, Price } from '@prisma/client';

import type { TErrorCodes } from './errorCodes';
import type { TProduct } from './products';

export type TOrder = Omit<Order, 'title'> & {
	amountOfProducts?: number | null;
	products?: TProduct[];
	prices?: Price[];
	location?: OrderLocation | null;
	title: string | null;
};

export type TOrderActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TOrder[];
};
