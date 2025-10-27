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
import { useDeleteLoadingSelector } from '@/context/products/useContext';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const [entities, setEntities] = useState<TOrder[] | undefined>(undefined);
	const { deleteEntity } = useDeleteEntityActions();
	const { getAllEntities } = useGetEntitiesActions();
	const deleteEntityPending = useDeleteLoadingSelector();

	const onDelete = useCallback(
		(onClose: () => void) => {
			deleteEntity({
				id,
				onSuccess: () => {
					onClose();
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
				{entities !== undefined && (
					<OrdersProvider>
						<OrderTable isDetail isDeleteButton={false} items={entities} />
					</OrdersProvider>
				)}
			</Popup>
		</div>
	);
});
