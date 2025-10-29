'use client';

import { useCallback, useEffect } from 'react';

import { getAddProductHref } from '@/utils/routing';

import { ProductsTable } from './Products';
import {
	useEntitiesTitleDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';
import { useAmountEntitiesSelector } from '@/context/products/useContext';

export const Container = () => {
	const setEntitiesTitleDispatch = useEntitiesTitleDispatch();
	const setEntitiesTotalDispatch = useSetEntitiesTotalDispatch();
	const setLinkAddEntityDispatch = useSetLinkAddEntityDispatch();
	const itemsCount = useAmountEntitiesSelector();

	const setEntitiesLayout = useCallback(() => {
		setEntitiesTitleDispatch('Products');
		setEntitiesTotalDispatch(itemsCount);
		setLinkAddEntityDispatch(getAddProductHref);
	}, [
		setEntitiesTitleDispatch,
		setEntitiesTotalDispatch,
		itemsCount,
		setLinkAddEntityDispatch
	]);

	useEffect(() => {
		setEntitiesLayout();
	}, []);

	return (
		<div className='mt-4'>
			<ProductsTable />
		</div>
	);
};
