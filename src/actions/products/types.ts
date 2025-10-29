import type { Prisma } from '@prisma/client';

export type TOptions = {
	selectFields?: Prisma.ProductSelect;
	whereFilters?: Prisma.ProductWhereInput;
};
