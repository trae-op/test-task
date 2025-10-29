'use client';

import { useActions } from '@/hooks/getOrders';

import { OrderTable } from './Orders';
import {
	useAmountEntitiesSelector,
	useSetAllEntitiesDispatch
} from '@/context/orders/useContext';

export const Container = () => {
	const itemsCount = useAmountEntitiesSelector();
	const { getAllEntities } = useActions();
	const setAllEntitiesDispatch = useSetAllEntitiesDispatch();

	return (
		<div className='mt-4'>
			<OrderTable />
		</div>
	);
};
