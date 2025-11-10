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

export type TUpdateData = {
	title: string;
	serialNumber: string;
	photo: string;
	type: string;
	specification: string;
	guaranteeStart: string;
	guaranteeEnd: string;
	orderId: string;
	isNew: boolean;
	prices: {
		value: string;
		label: string;
		valueAmount: number;
		id: string;
		userId: string;
		isDefault: boolean;
	}[];
};
