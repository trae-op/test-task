import type { Prisma } from '@prisma/client';

export type TOptions = {
	selectFields?: Prisma.OrderSelect;
	whereFilters?: Prisma.OrderWhereInput;
};
