'use client';

import { useCallback, useEffect } from 'react';

import { getAddOrderHref } from '@/utils/routing';

import { OrderTable } from './Orders';
import {
	useEntitiesTitleDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';
import { useAmountEntitiesSelector } from '@/context/orders/useContext';

export const Container = () => {
	const setEntitiesTitleDispatch = useEntitiesTitleDispatch();
	const setEntitiesTotalDispatch = useSetEntitiesTotalDispatch();
	const setLinkAddEntityDispatch = useSetLinkAddEntityDispatch();
	const itemsCount = useAmountEntitiesSelector();

	const setEntitiesLayout = useCallback(() => {
		setEntitiesTitleDispatch('Orders');
		setEntitiesTotalDispatch(itemsCount);
		setLinkAddEntityDispatch(getAddOrderHref);
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
			<OrderTable />
		</div>
	);
};
