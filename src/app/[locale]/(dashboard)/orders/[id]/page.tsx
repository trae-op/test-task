import { CloseEntityButton } from '@/components/CloseEntityButton';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getPicturesByProducts } from '@/utils/products';

import { getPicturesByEntities } from '@/app/_actions/pictures/products';
import { AddProductButton } from '@/conceptions/AddProductButton';
import { OrderViewLocation } from '@/conceptions/OrderViewLocation';
import { OrderTable } from '@/conceptions/Orders';
import { getOrders } from '@/conceptions/Orders/actions';
import { DetailContainer } from '@/conceptions/Orders/components/DetailContainer';
import { Provider as OrdersProvider } from '@/conceptions/Orders/context';
import { ProductsTable } from '@/conceptions/Products';
import { Provider as ProductsProvider } from '@/conceptions/Products/context';

export default async function OrderPage({ params }: TDynamicPageProps) {
	const { id } = await params;

	const { items, ok } = await getOrders({
		selectFields: {
			id: true,
			title: true,
			products: {
				select: {
					id: true,
					title: true,
					photo: true,
					serialNumber: true,
					isNew: true
				}
			},
			date: true,
			amountOfProducts: true,
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
					displayName: true,
					id: true,
					orderId: true,
					userId: true
				}
			}
		}
	});

	const foundOrderById = items?.find(order => order.id === id);

	const picturesByProducts =
		foundOrderById && foundOrderById.products
			? await getPicturesByEntities(
					foundOrderById.products.map(product => product.id)
				)
			: undefined;

	const productsByOrder = foundOrderById?.products || [];
	const orderLocation = foundOrderById?.location ?? null;
	const picturesByProductId = picturesByProducts
		? getPicturesByProducts(picturesByProducts)
		: undefined;

	return (
		<ProductsProvider
			isAdaptiveTable
			items={productsByOrder.map(product => ({
				...product,
				photo: picturesByProductId ? picturesByProductId(product.id) : null
			}))}
		>
			<OrdersProvider
				entityId={id}
				isAdaptiveTable
				items={
					ok
						? items?.map(item => ({
								...item,
								amountOfProducts: item.products?.length || 0,
								title: null
							}))
						: []
				}
			>
				<DetailContainer>
					<div className='mt-4 row g-2'>
						<div className='mt-0 col-12 col-lg-5 col-xl-3'>
							<OrderTable isDeleteButton={false} isUpdateButton={false} />
						</div>
						<div className='position-relative bg-white mt-1 border rounded-2 col-12 col-lg-7 col-xl-9'>
							<CloseEntityButton
								style={{ width: '2rem', height: '2rem' }}
								aria-label='close'
								className='negative-top-rem1 z-3 position-absolute d-flex align-items-center justify-content-center border-0 negative-end-rem1'
								href='/orders'
							/>

							<div className='p-3'>
								<h2 className='fs-5'>{foundOrderById?.title}</h2>

								<div className='d-flex align-items-center justify-content-start gap-2'>
									<AddProductButton />

									<OrderViewLocation location={orderLocation} />
								</div>
							</div>

							<ProductsTable />
						</div>
					</div>
				</DetailContainer>
			</OrdersProvider>
		</ProductsProvider>
	);
}
