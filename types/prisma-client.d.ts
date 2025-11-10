import type { Prisma as PrismaNamespace } from '@prisma/client';

type TProductWithPrices = PrismaNamespace.ProductGetPayload<{
	include: { prices: true };
}>;

declare module '@prisma/client' {
	export type Product = TProductWithPrices;
}
