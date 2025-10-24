import { Suspense } from 'react';

import { CloseEntityButton } from '@/components/CloseEntityButton';
import { DetailEntityLoading } from '@/components/DetailEntityLoading/DetailEntityLoading';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getOrderById, getOrders } from '@/actions/orders';
import { AddProductButton } from '@/conceptions/AddProductButton';
import { OrderTable } from '@/conceptions/Orders';
import { ProductsTable } from '@/conceptions/Products';

async function Container({ params }: TDynamicPageProps) {
	const { id } = await params;

	// fetch orders list and selected order with products server-side
	const [responseOrders, responseOrder] = await Promise.all([
		getOrders(),
		getOrderById(id)
	]);
	const isOrdersArray = Array.isArray(responseOrders);

	return (
		<div className='row g-2'>
			<div className='col-12 col-lg-4 col-xl-3 mt-0'>
				<OrderTable
					items={isOrdersArray ? responseOrders : []}
					isDetail
					activeId={id}
				/>
			</div>
			<div className='col-12 col-lg-8 col-xl-9 position-relative bg-white rounded-2 mt-1 border'>
				<CloseEntityButton
					style={{ width: '2rem', height: '2rem' }}
					aria-label='close'
					className='d-flex align-items-center justify-content-center z-3 position-absolute negative-end-rem1 negative-top-rem1 border-0'
					href='/orders'
				/>

				<div className='p-3'>
					<h2 className='fs-5'>{responseOrder.orderTitle}</h2>

					<AddProductButton />
				</div>

				<ProductsTable
					items={responseOrder.products || []}
					isDetail
					isDeleteButton={false}
				/>
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
