'use client';

import { useActions } from '@/hooks/getProducts';

import { ProductsTable } from './Products';
import {
	useAmountEntitiesSelector,
	useSetAllEntitiesDispatch
} from '@/context/products/useContext';

export const Container = () => {
	const itemsCount = useAmountEntitiesSelector();
	const { getAllEntities } = useActions();
	const setAllEntitiesDispatch = useSetAllEntitiesDispatch();

	return (
		<div className='mt-4'>
			<ProductsTable />
		</div>
	);
};
