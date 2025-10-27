'use client';

import { memo, useCallback, useState } from 'react';
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
import { useDeleteLoadingSelector } from '@/context/orders/useContext';
import { Provider as ProductsProvider } from '@/context/products';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const [entities, setEntities] = useState<TProduct[] | undefined>(undefined);
	const { deleteEntity } = useDeleteEntityActions();
	const { getAllEntities } = useGetEntitiesActions();
	const isDeleteLoading = useDeleteLoadingSelector();

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
				applyDisabled={isDeleteLoading}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			>
				{entities !== undefined && (
					<ProductsProvider>
						<ProductsTable isDetail isDeleteButton={false} items={entities} />
					</ProductsProvider>
				)}
			</Popup>
		</div>
	);
});
