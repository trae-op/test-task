'use client';

import { memo, useCallback, useEffect } from 'react';

import { CloseEntityButton } from '@/components/CloseEntityButton';
import { LoadingPage } from '@/components/LoadingPage/LoadingPage';

import { useActions as useOrdersActions } from '@/hooks/getOrders';

import { createParams, getAddOrderHref } from '@/utils/routing/routing';

import { AddProductButton } from '../AddProductButton';
import { ProductsTable } from '../Products';

import { OrderTable } from './Orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import {
	useAmountEntitiesSelector as useAmountOrdersSelector,
	useListLoadingSelector as useListLoadingOrdersSelector,
	useEntityIdSelector as useOrderIdSelector,
	useEntityTitleSelector as useOrderTitleSelector,
	useSetAllEntitiesDispatch as useSetAllOrdersDispatch,
	useSetEntityTitleDispatch as useSetOrderTitleDispatch
} from '@/context/orders/useContext';
import { useSetAllEntitiesDispatch as useSetAllProductsDispatch } from '@/context/products/useContext';

const Wrapper = memo(() => {
	const pendingOrders = useListLoadingOrdersSelector();
	const title = useOrderTitleSelector();

	if (pendingOrders) {
		return <LoadingPage />;
	}

	return (
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
					<h2 className='fs-5'>{title}</h2>

					<AddProductButton />
				</div>

				<ProductsTable />
			</div>
		</div>
	);
});

export const DetailContainer = () => {
	const itemsCount = useAmountOrdersSelector();
	const { getAllEntities: getAllOrders } = useOrdersActions();
	const setAllOrdersDispatch = useSetAllOrdersDispatch();
	const setAllProductsDispatch = useSetAllProductsDispatch();
	const orderId = useOrderIdSelector();
	const setOrderTitleDispatch = useSetOrderTitleDispatch();

	const fetchOrders = useCallback(() => {
		getAllOrders({
			params: createParams({
				fields: [
					'id',
					'amountOfProducts',

					{
						products: ['id', 'title', 'photo', 'serialNumber', 'isNew', 'order']
					},
					'date'
				]
			}),
			onSuccess: response => {
				const orders = response.results.items;
				const foundOrderById = orders.find(order => order.id === orderId);
				const productsByOrder = foundOrderById?.products || [];
				setAllOrdersDispatch(orders);
				setAllProductsDispatch(productsByOrder);
				if (productsByOrder.length && productsByOrder[0].order) {
					setOrderTitleDispatch(productsByOrder[0].order.title);
				}
			}
		});
	}, [orderId]);

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				titleComponent={<AddEntityTitle title='Receipts' />}
				total={itemsCount}
			/>
			<Wrapper />
		</>
	);
};
