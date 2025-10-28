import type { Product } from '@prisma/client';

import { TOrder } from './orders';
import { TPrice } from './price';

export type TProduct = Product & {
	order?: TOrder;
	prices?: TPrice[];
};
