import { Suspense } from 'react';

import { getOrders } from '@/actions/orders';
import { Container } from '@/conceptions/Orders';
import { Provider } from '@/context/orders';

// async function Wrapper() {
// 	const orders = await getOrders();

// 	return (

// }

export default async function OrdersPage() {
	const orders = await getOrders();

	return (
		<Provider
			items={
				Array.isArray(orders)
					? orders.map(order => ({
							id: order.id as string,
							title: order.title as string,
							date: order.date as Date,
							description: order.description ?? null,
							amountOfProducts: order.amountOfProducts ?? null,
							userId: order.userId as string
						}))
					: []
			}
		>
			<Container />
		</Provider>
	);
}
