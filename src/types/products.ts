import type { Product } from '@prisma/client';

import { TOrder } from './orders';

export type TProduct = Product & {
	order?: TOrder;
};
