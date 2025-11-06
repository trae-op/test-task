import type { ProductType } from '@prisma/client';

import type { TErrorCodes } from './errorCodes';

export type TProductType = ProductType;

export type TProductTypeActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TProductType[];
};
