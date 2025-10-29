import { getOrders } from '@/actions/orders';
import { Container } from '@/conceptions/Orders';
import { Provider } from '@/context/orders';

export default async function OrdersPage({
	searchParams
}: {
	searchParams: Promise<any>;
}) {
	const data = await searchParams;

	const { items, ok } = await getOrders();

	return (
		<Provider items={ok ? items : []}>
			<Container />
		</Provider>
	);
}
