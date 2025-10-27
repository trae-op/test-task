'use client';

import { memo, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import { EmptyData } from '@/components/EmptyData';
import { LoadingPage } from '@/components/LoadingPage/LoadingPage';

import { useActions as useGetEntitiesActions } from '@/hooks/getOrders';

import { TOrder } from '@/types/orders';

import { getAddOrderHref, getCollectParams } from '@/utils/routing/routing';

import { OrderTable } from './Orders';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import {
	useListSelector,
	useSetAllDispatch
} from '@/context/orders/useContext';

const Orders = memo(
	({ pending, items }: { pending: boolean; items: TOrder[] }) => {
		if (pending) {
			return <LoadingPage />;
		}

		if (!items.length) {
			return <EmptyData text='Could not find any orders' />;
		}

		return (
			<div className='mt-4'>
				<LoadingPage />
				<OrderTable />
			</div>
		);
	}
);

export const Container = () => {
	const { getAllEntities, pending } = useGetEntitiesActions();
	const setAllEntities = useSetAllDispatch();
	const items = useListSelector();

	useEffect(() => {
		getAllEntities({
			params: getCollectParams<string, TOrder>(),

			onSuccess: response => {
				setAllEntities(response.results.items);
			}
		});
	}, []);

	return (
		<>
			<AddEntity
				addEntityHref={getAddOrderHref}
				titleComponent={<AddEntityTitle title='Receipts' />}
				total={items.length}
			/>
			<Orders pending={pending} items={items} />
		</>
	);
};
