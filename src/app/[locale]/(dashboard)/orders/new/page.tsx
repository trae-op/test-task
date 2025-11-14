import { AddOrder } from '@/conceptions/AddOrder';
import { getProducts } from '@/conceptions/Products/actions';

export default async function AddOrderPage() {
	const { items, ok } = await getProducts({
		whereFilters: {
			isNew: true,
			order: null
		}
	});

	return <AddOrder products={ok && items !== undefined ? items : []} />;
}
