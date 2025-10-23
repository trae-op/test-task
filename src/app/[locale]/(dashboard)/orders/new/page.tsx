import { getProducts } from '@/actions/products';
import { AddOrder } from '@/conceptions/AddOrder';

export default async function AddOrderPage() {
	const products = await getProducts();
	const isProductsArray = Array.isArray(products);

	return <AddOrder products={isProductsArray ? products : []} />;
}
