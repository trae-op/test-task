import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { EmptyData } from '@/components/EmptyData';

import { getAddOrderHref } from '@/utils/routing/routing';

import { getOrders } from '@/actions/orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import {
	OrderTable,
	Provider as ProviderContainer
} from '@/conceptions/Orders';

async function Container() {
	const orders = await getOrders();
	const isOrdersArray = Array.isArray(orders);
	const items = isOrdersArray ? orders : [];

	return (
		<ProviderContainer items={items}>
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
		</ProviderContainer>
	);
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
