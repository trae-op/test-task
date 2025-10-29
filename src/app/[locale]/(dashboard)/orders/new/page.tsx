import { getProducts } from '@/actions/products';
import { AddOrder } from '@/conceptions/AddOrder';

export default async function AddOrderPage() {
	const { items, ok } = await getProducts();

	return <AddOrder products={ok && items !== undefined ? items : []} />;
}
