import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TOrderData } from '@/types/order';

import { fetchOrders } from '@/utils/orders';
import { getAddOrderHref } from '@/utils/routing/routing';

import { AddEntity } from '@/conceptions/AddEntity';
import { OrderTable } from '@/conceptions/Orders';

async function Container() {
	const items: TOrderData[] = await fetchOrders();
	if (!items?.length) {
		return <NotFound />;
	}
	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				title='Receipts'
				total={items.length}
			/>
			<div className='mt-4'>
				<OrderTable items={items} />
			</div>
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
