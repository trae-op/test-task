'use client';

import { memo, useCallback, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteProduct';
import { useActions as useGetEntitiesActions } from '@/hooks/getProducts';

import { TOrder } from '@/types/orders';
import { TProduct } from '@/types/products';

import { getCollectParams } from '@/utils/routing';

import type { TDeleteEntityProps } from './types';
import { OrderTable } from '@/conceptions/Orders';
import { Provider as OrdersProvider } from '@/context/orders';
import { useRemoveDispatch } from '@/context/products/useContext';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const removeEntity = useRemoveDispatch();
	const [entities, setEntities] = useState<TOrder[] | undefined>(undefined);
	const { deleteEntity, pending: deleteEntityPending } =
		useDeleteEntityActions();
	const { getAllEntities, pending: entityPending } = useGetEntitiesActions();

	const onDelete = useCallback(
		(onClose: () => void) => {
			deleteEntity({
				id,
				onSuccess: () => {
					onClose();
					removeEntity(id);
				}
			});
		},
		[id]
	);

	const onOpen = useCallback(() => {
		getAllEntities({
			params: getCollectParams<string, TProduct>({
				entityId: id,
				fields: ['order']
			}),

			onSuccess: response => {
				const order = response.results.items[0]?.order;
				setEntities(order ? [order] : []);
			}
		});
	}, [id]);

	return (
		<div className='d-flex align-items-center justify-content-center w-100 h-100'>
			<Popup
				componentButton={DeleteEntityButton}
				applyIconButton={Trash}
				iconButton={Trash}
				onOpen={onOpen}
				openButtonAriaLabel='Delete'
				applyText='Delete'
				applyDisabled={deleteEntityPending}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			>
				{Boolean(entityPending && !entities?.length) && (
					<Placeholder animation='glow' className='w-100'>
						<Placeholder className='my-1 w-100' style={{ height: '4rem' }} />
					</Placeholder>
				)}

				{entities !== undefined && (
					<OrdersProvider items={entities}>
						<OrderTable isDetail isDeleteButton={false} />
					</OrdersProvider>
				)}
			</Popup>
		</div>
	);
});
