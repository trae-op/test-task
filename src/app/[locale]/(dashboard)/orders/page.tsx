import { Container } from '@/conceptions/Orders';
import { Provider } from '@/context/orders';

export default function OrdersPage() {
	return (
		<Provider>
			<Container />
		</Provider>
	);
}
