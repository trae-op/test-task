import { Container } from '@/conceptions/Products';
import { Provider } from '@/context/products';

export default function OrdersPage() {
	return (
		<Provider>
			<Container />
		</Provider>
	);
}
