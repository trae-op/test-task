import { AddOrder } from '@/components/AddOrder';
import type { OptionType } from '@/components/ui/MultiSelectField/types';

import { prisma } from '../../../../../prisma/prisma-client';

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
