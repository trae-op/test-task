import { getOrders } from '@/app/_conceptions/Orders/actions';
import { Container } from '@/conceptions/OrderDynamics';

export default async function OrderDynamicsPage() {
	const response = await getOrders({
		selectFields: {
			id: true,
			date: true,
			products: {
				select: {
					id: true,
					prices: true
				}
			}
		}
	});

	return (
		<Container
			orders={
				response.ok && response.items
					? response.items.map(order => {
							return {
								...order,
								date: order.date ? order.date.toISOString() : null
							};
						})
					: []
			}
		/>
	);
}
