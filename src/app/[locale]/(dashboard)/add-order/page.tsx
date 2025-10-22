import type { OptionType } from '@/components/MultiSelectField/types';

import { AddOrder } from '@/app/_conceptions/AddOrder';
import { prisma } from '@/prisma/prisma-client';

export default async function AddOrderPage() {
	const products = await prisma.product.findMany({
		select: { id: true, title: true }
	});

	const productOptions: OptionType[] = products.map(p => ({
		value: p.id,
		label: p.title
	}));

	return <AddOrder productOptions={productOptions} />;
}
