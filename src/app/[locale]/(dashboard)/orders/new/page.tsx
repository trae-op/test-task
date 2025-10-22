import { fetchProducts } from '@/utils/products';

import { AddOrder } from '@/app/_conceptions/AddOrder';

export default async function AddOrderPage() {
	const items = await fetchProducts();

	return <AddOrder products={items} />;
}
