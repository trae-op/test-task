import { Suspense } from 'react';

import { OrderTable } from '@/components/Orders';
import { ProductsTable } from '@/components/Products';
import { CloseEntityButton } from '@/components/ui/CloseEntityButton';
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
		photo: 'https://placehold.co/400x400.png',
		title: 'Product 1'
	},
	{
		id: '2',
		serialNumber: '123433',
		isNew: 0,
		photo: 'https://placehold.co/400x400.png',
		title: 'Product 2'
	},
	{
		id: '3',
		serialNumber: '12343355',
		isNew: 1,
		photo: 'https://placehold.co/400x400.png',
		title: 'Product 3'
	}
];

async function Container({ params }: TDynamicPageProps) {
	const { id } = await params;

	return (
		<div className='row g-1'>
			<div className='col-12 col-lg-4 col-xl-3'>
				<OrderTable items={orders} isDetail />
			</div>
			<div className='col-12 col-lg-8 col-xl-9 position-relative'>
				<CloseEntityButton
					style={{ width: '2rem', height: '2rem' }}
					aria-label='close'
					className='d-flex align-items-center justify-content-center z-3 position-absolute negative-end-rem1 negative-top-rem1 border-0'
					href='/orders'
				/>

				<ProductsTable items={products} isDetail />
			</div>
		</div>
	);
}

export default function OrderPage(props: TDynamicPageProps) {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container {...props} />
		</Suspense>
	);
}
