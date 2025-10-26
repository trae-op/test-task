import { Suspense } from 'react';

import { CloseEntityButton } from '@/components/CloseEntityButton';
import { DetailEntityLoading } from '@/components/DetailEntityLoading/DetailEntityLoading';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getOrderById, getOrders } from '@/actions/orders';
import { AddProductButton } from '@/conceptions/AddProductButton';
import { OrderTable } from '@/conceptions/Orders';
import { ProductsTable } from '@/conceptions/Products';
import { Provider as OrdersProvider } from '@/context/orders';
import { Provider as ProductsProvider } from '@/context/products';

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
			<div className='mt-0 col-12 col-lg-4 col-xl-3'>
				<OrdersProvider items={isOrdersArray ? responseOrders : []}>
					<OrderTable isDetail activeId={id} />
				</OrdersProvider>
			</div>
			<div className='position-relative bg-white mt-1 border rounded-2 col-12 col-lg-8 col-xl-9'>
				<CloseEntityButton
					style={{ width: '2rem', height: '2rem' }}
					aria-label='close'
					className='negative-top-rem1 z-3 position-absolute d-flex align-items-center justify-content-center border-0 negative-end-rem1'
					href='/orders'
				/>

				<div className='p-3'>
					<h2 className='fs-5'>{responseOrder.orderTitle}</h2>

					<AddProductButton />
				</div>

				<ProductsProvider items={responseOrder.products || []}>
					<ProductsTable isDetail isDeleteButton={false} />
				</ProductsProvider>
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
