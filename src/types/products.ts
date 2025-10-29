import type { Product } from '@prisma/client';

import { TErrorCodes } from './errorCodes';
import { TOrder } from './orders';
import { TPrice } from './price';

export type TProduct = Product & {
	order?: TOrder;
	prices?: TPrice[];
};

export type TProductActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TProduct[];
};
