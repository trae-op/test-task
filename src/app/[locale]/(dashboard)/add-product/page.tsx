import { AddProduct } from '@/components/AddProduct';
import type { SelectOption } from '@/components/ui/SelectField/types';

import { prisma } from '@/prisma/prisma-client';

const TYPE_OPTIONS: SelectOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'laptop', label: 'Laptop' },
	{ value: 'monitor', label: 'Monitor' }
];

export default async function AppProductPage() {
	const orders = await prisma.order.findMany({
		select: { id: true, title: true }
	});
	const orderOptions: SelectOption[] = orders.map(o => ({
		value: o.id,
		label: o.title
	}));

	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'UAH', label: 'UAH' }
	];

	return (
		<AddProduct
			typeOptions={TYPE_OPTIONS}
			orderOptions={orderOptions}
			currencyOptions={currencyOptions}
		/>
	);
}
