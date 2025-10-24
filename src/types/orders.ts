import type { Order } from '@prisma/client';

export type TOrder = Order & {
	amountOfProducts: number | null | undefined;
};
