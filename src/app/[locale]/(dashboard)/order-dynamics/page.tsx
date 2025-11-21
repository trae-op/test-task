import { Container } from '@/conceptions/OrderDynamics';
import { getOrders } from '@/conceptions/Orders/actions';

export default async function OrderDynamicsPage() {
	const { items, ok } = await getOrders({
		selectFields: {
			id: true,
			title: true,
			location: true,
			products: {
				select: {
					id: true,
					title: true,
					photo: true,
					prices: true,
					isNew: true,
					serialNumber: true
				}
			},
			date: true,
			amountOfProducts: true
		}
	});
	const orders = ok && items !== undefined ? items : [];

	return (
		<Container
			orders={orders.map(order => {
				return {
					...order,
					date: order.date ? order.date.toISOString() : null
				};
			})}
		/>
	);
}
