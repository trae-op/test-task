import type { Prisma as PrismaNamespace } from '@prisma/client';

// Module augmentation: make `Product` exported from '@prisma/client' include the `prices` relation.
// After this file is loaded by the TypeScript compiler, `import type { Product } from '@prisma/client'`
// will refer to the Product type that includes `prices: Price[]`.

declare module '@prisma/client' {
	// Use Prisma's ProductGetPayload helper to build the shape with `prices` included
	export type Product = PrismaNamespace.ProductGetPayload<{
		include: { prices: true };
	}>;
}
