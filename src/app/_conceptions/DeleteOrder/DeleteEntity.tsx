'use client';

import { memo, useCallback, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteOrder';
import { useActions as useGetEntitiesActions } from '@/hooks/getOrders';

import { TOrder } from '@/types/orders';
import { TProduct } from '@/types/products';

import { getCollectParams } from '@/utils/routing';

import type { TDeleteEntityProps } from './types';
import { ProductsTable } from '@/conceptions/Products';
import { useRemoveDispatch } from '@/context/orders/useContext';
import { Provider as ProductsProvider } from '@/context/products';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const removeEntity = useRemoveDispatch();
	const [entities, setEntities] = useState<TProduct[] | undefined>(undefined);
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
			params: getCollectParams<string, TOrder>({
				entityId: id,
				fields: ['title', 'products']
			}),

			onSuccess: response => {
				setEntities(response.results.items[0]?.products || []);
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
					<ProductsProvider items={entities}>
						<ProductsTable isDetail isDeleteButton={false} />
					</ProductsProvider>
				)}
			</Popup>
		</div>
	);
});
