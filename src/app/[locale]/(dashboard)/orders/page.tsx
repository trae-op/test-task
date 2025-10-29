import { getOrders } from '@/actions/orders';
import { Container } from '@/conceptions/Orders';
import { Provider } from '@/context/orders';

export default async function OrdersPage() {
	const { items, ok } = await getOrders({
		selectFields: {
			id: true,
			title: true,
			products: {
				select: {
					id: true,
					title: true,
					photo: true,
					serialNumber: true
				}
			},
			date: true,
			amountOfProducts: true
		}
	});

	return (
		<Provider items={ok ? items : []}>
			<Container />
		</Provider>
	);
}
