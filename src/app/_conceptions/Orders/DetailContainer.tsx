'use client';

import { ReactElement, useCallback, useEffect } from 'react';

import { getAddOrderHref } from '@/utils/routing';

import {
	useEntitiesTitleDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';
import { useAmountEntitiesSelector } from '@/context/orders/useContext';

export const DetailContainer = ({ children }: { children?: ReactElement }) => {
	const setEntitiesTitleDispatch = useEntitiesTitleDispatch();
	const setEntitiesTotalDispatch = useSetEntitiesTotalDispatch();
	const setLinkAddEntityDispatch = useSetLinkAddEntityDispatch();
	const itemsCount = useAmountEntitiesSelector();

	const setEntitiesLayout = useCallback(() => {
		setEntitiesTitleDispatch('Receipts');
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

	return <div className='mt-4'>{children}</div>;
};
