import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TOrderData } from '@/types/order';

import { fetchOrders } from '@/utils/orders';

import { OrderTable } from '@/app/_conceptions/Orders';

async function Container() {
	const items: TOrderData[] = await fetchOrders();
	if (!items?.length) {
		return <NotFound />;
	}
	return <OrderTable items={items} />;
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<DetailEntityLoading />}>
			<Container />
		</Suspense>
	);
}
