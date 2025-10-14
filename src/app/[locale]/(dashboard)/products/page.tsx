import { ProductsTable } from '@/components/Products';
import type { TProductData } from '@/components/Products/types';

const products: TProductData[] = [
	{
		id: '1',
		serialNumber: '1234',
		isNew: 1,
		photo: '',
		title: 'Product 1',
		type: 'Monitors',
		specification: 'Specification 1',
		guarantee: {
			start: new Date('2017-06-29 12:09:33'),
			end: new Date('2017-06-29 12:09:33')
		},
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		order: 1,
		date: new Date('2017-06-29 12:09:33')
	},
	{
		id: '2',
		serialNumber: '1234',
		isNew: 0,
		photo: '',
		title: 'Product 1',
		type: 'Monitors',
		specification: 'Specification 1',
		guarantee: {
			start: new Date('2017-06-29 12:09:33'),
			end: new Date('2017-06-29 12:09:33')
		},
		price: [
			{ value: 100, symbol: 'USD', isDefault: 0 },
			{ value: 2600, symbol: 'UAH', isDefault: 1 }
		],
		order: 2,
		date: new Date('2017-06-29 12:09:33')
	}
];

export default function ProductsPage() {
	return (
		<>
			<ProductsTable items={products} />
		</>
	);
}
