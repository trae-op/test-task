import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { EmptyData } from '@/components/EmptyData';

import { getAddOrderHref } from '@/utils/routing/routing';

import { getOrders } from '@/actions/orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import { EntitiesProvider } from '@/conceptions/EntitiesProvider';
import { OrderTable } from '@/conceptions/Orders';

async function Container() {
	const orders = await getOrders();
	const isOrdersArray = Array.isArray(orders);
	const items = isOrdersArray ? orders : [];

	return (
		<EntitiesProvider items={items}>
			<>
				<AddEntity
					addEntityHref={getAddOrderHref}
					titleComponent={<AddEntityTitle title='Receipts' />}
					total={items.length}
				/>
				{!items.length ? (
					<EmptyData text='Could not find any orders' />
				) : (
					<div className='mt-4'>
						<OrderTable />
					</div>
				)}
			</>
		</EntitiesProvider>
	);
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
