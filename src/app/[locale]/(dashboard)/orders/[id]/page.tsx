import { Suspense } from 'react';

import { OrderTable } from '@/components/Orders';
import { ProductsTable } from '@/components/Products';
import { DetailEntityLoading } from '@/components/ui/DetailEntityLoading/DetailEntityLoading';

import type { TDynamicPageProps } from '@/types/dynamicPage';
import type { TOrderData } from '@/types/order';
import type { TProductData } from '@/types/product';

const orders: TOrderData[] = [
	{
		id: '1',
		date: new Date('2017-06-29 12:09:33'),
		products: ['1', '2', '3']
	},
	{
		id: '2',
		date: new Date('2017-06-29 12:09:33'),
		products: ['3', '4', '5', '6']
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

async function Container({ params }: TDynamicPageProps) {
	const { id } = await params;

	return (
		<div className='d-flex gap-1'>
			<div className='w-50'>
				<OrderTable items={orders} isDetail />
			</div>
			<div className='w-75'>
				<ProductsTable items={products} isDetail />
			</div>
		</div>
	);
}

export default function OrderPage(data: TDynamicPageProps) {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container {...data} />
		</Suspense>
	);
}
