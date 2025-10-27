import type { Order } from '@prisma/client';

import { TProduct } from './products';

export type TOrder = Order & {
	amountOfProducts?: number | null;
	products?: TProduct[];
};
