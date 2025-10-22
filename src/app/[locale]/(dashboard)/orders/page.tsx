import { Suspense } from 'react';

import { DetailEntityLoading } from '@/components/DetailEntityLoading';
import { NotFound } from '@/components/NotFound';

import type { TOrderData } from '@/types/order';

import { API_ORDERS_PATH, getApiUrl } from '@/utils/routing';

import { OrderTable } from '@/app/_conceptions/Orders';

async function Container() {
	const res = await fetch(getApiUrl(API_ORDERS_PATH), {
		next: { tags: ['orders'] }
	});
	const items: TOrderData[] = await res.json();
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
