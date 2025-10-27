'use client';

import { memo, useEffect } from 'react';

import { LoadingPage } from '@/components/LoadingPage/LoadingPage';

import { useActions } from '@/hooks/getProducts';

import { getAddOrderHref } from '@/utils/routing/routing';

import { ProductsTable } from './Products';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import {
	useAmountEntitiesSelector,
	useListLoadingSelector,
	useSetAllEntitiesDispatch
} from '@/context/products/useContext';

const Products = memo(() => {
	const pending = useListLoadingSelector();

	if (pending) {
		return <LoadingPage />;
	}

	return (
		<div className='mt-4'>
			<ProductsTable />
		</div>
	);
});

export const Container = () => {
	const itemsCount = useAmountEntitiesSelector();
	const { getAllEntities } = useActions();
	const setAllEntitiesDispatch = useSetAllEntitiesDispatch();

	useEffect(() => {
		getAllEntities({
			params: '',
			onSuccess: response => {
				setAllEntitiesDispatch(response.results.items);
			}
		});
	}, []);

	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				titleComponent={<AddEntityTitle title='Products' />}
				total={itemsCount}
			/>
			<Products />
		</>
	);
};
