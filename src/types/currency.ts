import type { Currency } from '@prisma/client';

import type { TErrorCodes } from './errorCodes';

export type TCurrency = Currency;

export type TCurrencyActionResult = {
	ok: boolean;
	code?: TErrorCodes;
	items?: TCurrency[];
};
