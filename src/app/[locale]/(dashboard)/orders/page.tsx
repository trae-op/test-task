import { getPicturesByProducts } from '@/utils/products';

import { getPicturesByEntities } from '@/actions/pictures/products';
import { getProducts } from '@/actions/products';
import { getOrders } from '@/app/_conceptions/Orders/actions';
import { Provider } from '@/app/_conceptions/Orders/context';
import { Container } from '@/conceptions/Orders';

export default async function OrdersPage() {
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
	const orderIds = orders.map(order => order.id);

	const productsByOrders =
		orderIds.length > 0
			? await getProducts({
					selectFields: {
						id: true
					},
					whereFilters: {
						orderId: {
							in: orderIds
						}
					}
				})
			: undefined;

	const productsInOrders =
		productsByOrders !== undefined &&
		productsByOrders.ok &&
		productsByOrders.items !== undefined
			? productsByOrders.items
			: [];

	const productIds = productsInOrders.map(product => product.id);

	const picturesByProducts =
		productIds.length > 0 ? await getPicturesByEntities(productIds) : undefined;

	const picturesByProductId =
		picturesByProducts !== undefined
			? getPicturesByProducts(picturesByProducts)
			: undefined;

	const ordersWithPictures = orders.map(order => ({
		...order,
		products: order.products?.map(product => ({
			...product,
			photo: picturesByProductId ? picturesByProductId(product.id) : null
		}))
	}));

	return (
		<Provider items={ordersWithPictures}>
			<Container />
		</Provider>
	);
}
