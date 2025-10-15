import { OrderTable } from '@/components/Orders';
import { ProductsTable } from '@/components/Products';

import type { TOrderData } from '@/types/order';
import type { TProductData } from '@/types/product';

import type { TPageProps } from './types';

const orders: TOrderData[] = [
	{
		id: '1',
		date: new Date('2017-06-29 12:09:33'),
		products: ['1', '2', '3'],
		isDeleteButton: false
	},
	{
		id: '2',
		date: new Date('2017-06-29 12:09:33'),
		products: ['3', '4'],
		isDeleteButton: false
	}
];

const products: TProductData[] = [
	{
		id: '1',
		serialNumber: '1234',
		isNew: 1,
		photo: '',
		title: 'Product 1'
	},
	{
		id: '2',
		serialNumber: '123433',
		isNew: 0,
		photo: '',
		title: 'Product 2'
	},
	{
		id: '3',
		serialNumber: '12343355',
		isNew: 1,
		photo: '',
		title: 'Product 3'
	}
];

export default async function OrderPage({ params }: TPageProps) {
	const { id } = await params;

	return (
		<div className='d-flex gap-1'>
			<OrderTable items={orders} />
			<ProductsTable items={products} />
		</div>
	);
}
