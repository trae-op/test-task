import type { Order } from '@prisma/client';

import type { TErrorCodes } from './errorCodes';
import type { TProduct } from './products';

export type TOrder = Order & {
	amountOfProducts?: number | null;
	products?: TProduct[];
};

export type TOrderActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TOrder[];
};
