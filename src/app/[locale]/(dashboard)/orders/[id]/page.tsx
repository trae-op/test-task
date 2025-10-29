import { CloseEntityButton } from '@/components/CloseEntityButton';

import type { TDynamicPageProps } from '@/types/dynamicPage';

import { getOrders } from '@/actions/orders';
import { AddProductButton } from '@/conceptions/AddProductButton';
import { OrderTable } from '@/conceptions/Orders';
import { ProductsTable } from '@/conceptions/Products';
import { Provider as OrdersProvider } from '@/context/orders';
import { Provider as ProductsProvider } from '@/context/products';

export default async function OrderPage({ params }: TDynamicPageProps) {
	const { id } = await params;

	const { items, ok } = await getOrders({
		selectFields: {
			id: true,
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
			amountOfProducts: true
		}
	});

	const foundOrderById = items?.find(order => order.id === id);
	const productsByOrder = foundOrderById?.products || [];

	return (
		<ProductsProvider items={productsByOrder}>
			<OrdersProvider entityId={id} items={ok ? items : []}>
				<div className='mt-4 row g-2'>
					<div className='mt-0 col-12 col-lg-4 col-xl-3'>
						<OrderTable isDeleteButton={false} />
					</div>
					<div className='position-relative bg-white mt-1 border rounded-2 col-12 col-lg-8 col-xl-9'>
						<CloseEntityButton
							style={{ width: '2rem', height: '2rem' }}
							aria-label='close'
							className='negative-top-rem1 z-3 position-absolute d-flex align-items-center justify-content-center border-0 negative-end-rem1'
							href='/orders'
						/>

						<div className='p-3'>
							<h2 className='fs-5'>{foundOrderById?.title}</h2>

							<AddProductButton />
						</div>

						<ProductsTable />
					</div>
				</div>
			</OrdersProvider>
		</ProductsProvider>
	);
}
