import type { SelectOption } from '@/components/SelectField/types';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getProducts } from '@/actions/products/action';
import { Container } from '@/conceptions/UpdateProduct/Container';

const TYPE_OPTIONS: SelectOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'laptop', label: 'Laptop' },
	{ value: 'monitor', label: 'Monitor' }
];

const convertISODateToInputDate = (isoString: string): string => {
	// Якщо рядок порожній або не існує, повертаємо порожній рядок
	if (!isoString) return '';

	// Обрізаємо рядок до перших 10 символів (YYYY-MM-DD)
	// Наприклад: "2025-02-02T00:00:00.000Z" -> "2025-02-02"
	return isoString.substring(0, 10);
};

export default async function UpdateProductPage({ params }: TDynamicPageProps) {
	const { id, locale } = await params;
	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'UAH', label: 'UAH' }
	];

	const { items, ok } = await getProducts({
		selectFields: {
			id: true,
			title: true,
			photo: true,
			serialNumber: true,
			guaranteeStart: true,
			guaranteeEnd: true,
			specification: true,
			prices: true,
			order: true,
			isNew: true,
			type: true
		},
		whereFilters: { id }
	});
	const product = ok && items?.length ? items[0] : undefined;

	// console.log('>>> product for update:', product);

	return (
		<Container
			typeOptions={TYPE_OPTIONS}
			currencyOptions={currencyOptions}
			defaultValues={{
				title: product?.title || '',
				serialNumber: product?.serialNumber || '',
				type: product?.type || '',
				specification: product?.specification || '',
				guaranteeStart: convertISODateToInputDate(
					product?.guaranteeStart?.toISOString() || ''
				),
				guaranteeEnd: convertISODateToInputDate(
					product?.guaranteeEnd?.toISOString() || ''
				),
				orderId: product?.orderId || '',
				isNew: product?.isNew || false,
				prices: product?.prices
					? product.prices.map(price => ({
							value: price.symbol + '',
							label: `${price.isDefault ? 'Default' : ''} ${price.value} ${price.symbol}`,
							valueAmount: Number(price.value),
							id: price.id,
							userId: price.userId,
							isDefault: price.isDefault
						}))
					: []
			}}
		/>
	);
}
