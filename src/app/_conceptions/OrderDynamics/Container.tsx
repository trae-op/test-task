'use client';

import { useEffect } from 'react';

import { getAddOrderHref } from '@/utils/routing';

import { OrderDynamicsChart } from './OrderDynamics';
import type { TOrderDynamicsProps } from './types';
import {
	useEntitiesTitleDispatch,
	useSetEntitiesTotalDispatch,
	useSetLinkAddEntityDispatch
} from '@/context/global/useContext';

export const Container = ({ orders }: TOrderDynamicsProps) => {
	const setEntitiesTitle = useEntitiesTitleDispatch();
	const setEntitiesTotal = useSetEntitiesTotalDispatch();
	const setLinkAddEntity = useSetLinkAddEntityDispatch();

	const totalOrders = orders.length;

	useEffect(() => {
		setEntitiesTitle('Order Dynamics');
		setEntitiesTotal(totalOrders);
		setLinkAddEntity(getAddOrderHref);
	}, [setEntitiesTitle, setEntitiesTotal, setLinkAddEntity, totalOrders]);

	return (
		<div className='mt-4'>
			<OrderDynamicsChart orders={orders} />
		</div>
	);
};
