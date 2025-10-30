import { getProducts } from '@/actions/products';
import { Container } from '@/conceptions/Products';
import { Provider } from '@/context/products';

export default async function ProductsPage() {
	const { items, ok } = await getProducts({
		selectFields: {
			id: true,
			title: true,
			photo: true,
			serialNumber: true,
			guaranteeStart: true,
			guaranteeEnd: true,
			prices: true,
			order: true,
			isNew: true
		}
	});

	return (
		<Provider items={ok ? items : []}>
			<Container />
		</Provider>
	);
}
