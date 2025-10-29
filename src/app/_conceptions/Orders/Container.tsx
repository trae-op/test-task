'use client';

import { memo, useEffect } from 'react';

import { LoadingPage } from '@/components/LoadingPage/LoadingPage';

import { useActions } from '@/hooks/getOrders';

import { createParams, getAddOrderHref } from '@/utils/routing/routing';

import { OrderTable } from './Orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import {
	useAmountEntitiesSelector,
	useListLoadingSelector,
	useSetAllEntitiesDispatch
} from '@/context/orders/useContext';

const Orders = memo(() => {
	const pending = useListLoadingSelector();

	if (pending) {
		return <LoadingPage />;
	}

	return (
		<div className='mt-4'>
			<OrderTable />
		</div>
	);
});

export const Container = () => {
	const itemsCount = useAmountEntitiesSelector();
	const { getAllEntities } = useActions();
	const setAllEntitiesDispatch = useSetAllEntitiesDispatch();
	// symbol: $Enums.Currency;
	// id: string;
	// userId: string;
	// value: number;
	// isDefault: boolean;
	// productId: string;
	// useEffect(() => {
	// 	getAllEntities({
	// 		params: createParams({
	// 			fields: [
	// 				'id',
	// 				'title',
	// 				'amountOfProducts',
	// 				'description',
	// 				{
	// 					products: [
	// 						'id',
	// 						'title',
	// 						'photo',
	// 						'serialNumber',
	// 						'isNew',
	// 						'prices'
	// 					]
	// 				},
	// 				'date'
	// 			]
	// 		}),
	// 		onSuccess: response => {
	// 			setAllEntitiesDispatch(response.results.items);
	// 		}
	// 	});
	// }, []);

	console.log('Container render');

	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				titleComponent={<AddEntityTitle title='Receipts' />}
				total={itemsCount}
			/>
			<div className='mt-4'>
				<OrderTable />
			</div>
		</>
	);
};
