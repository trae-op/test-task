import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { EmptyData } from '@/components/EmptyData';

import { getAddOrderHref } from '@/utils/routing/routing';

import { getOrders } from '@/actions/orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import { OrderTable } from '@/conceptions/Orders';

async function Container() {
	const orders = await getOrders();
	const isOrdersArray = Array.isArray(orders);

	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				titleComponent={<AddEntityTitle title='Receipts' />}
				total={isOrdersArray ? orders.length : 0}
			/>
			{isOrdersArray && !orders.length ? (
				<EmptyData text='Could not find any orders' />
			) : (
				<div className='mt-4'>
					<OrderTable items={isOrdersArray ? orders : []} />
				</div>
			)}
		</>
	);
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
