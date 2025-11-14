import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getProducts } from '@/actions/products/action';
import { getOrders } from '@/app/_conceptions/Orders/actions/action';
import { getPickupLocations } from '@/app/_conceptions/Settings/actions/pickupLocation';
import { Provider as PickupLocationProvider } from '@/app/_conceptions/Settings/context/pickupLocation';
import { Container } from '@/conceptions/UpdateOrder/Container';

export default async function UpdateOrderPage({ params }: TDynamicPageProps) {
	const { id } = await params;

	const orderRes = await getOrders({
		selectFields: {
			id: true,
			title: true,
			description: true,
			products: { select: { id: true, title: true } },
			location: {
				select: {
					latitude: true,
					longitude: true,
					country: true,
					state: true,
					city: true,
					district: true,
					street: true,
					postcode: true,
					displayName: true
				}
			}
		},
		whereFilters: { id }
	});

	const order =
		orderRes.ok && orderRes.items?.length ? orderRes.items[0] : undefined;

	const [productsRes, pickupLocationsRes] = await Promise.all([
		getProducts({
			selectFields: { id: true, title: true },
			whereFilters: {
				isNew: true,
				OR: [{ orderId: null }, { orderId: id }]
			}
		}),
		getPickupLocations()
	]);

	const products =
		productsRes.ok && productsRes.items
			? productsRes.items.map(p => ({ id: p.id, title: p.title }))
			: [];

	const pickupLocations = pickupLocationsRes.ok
		? (pickupLocationsRes.items ?? [])
		: [];

	return (
		<PickupLocationProvider items={pickupLocations}>
			<Container values={order} products={products} />
		</PickupLocationProvider>
	);
}
