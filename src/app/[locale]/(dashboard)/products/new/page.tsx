import type { SelectOption } from '@/components/SelectField/types';

import { AddProduct } from '@/conceptions/AddProduct';

const TYPE_OPTIONS: SelectOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'laptop', label: 'Laptop' },
	{ value: 'monitor', label: 'Monitor' }
];

export default async function AppProductPage() {
	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'UAH', label: 'UAH' }
	];

	return (
		<AddProduct typeOptions={TYPE_OPTIONS} currencyOptions={currencyOptions} />
	);
}
