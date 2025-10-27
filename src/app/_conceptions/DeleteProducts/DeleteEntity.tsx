'use client';

import { memo, useCallback, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteProduct';

import { TOrder } from '@/types/orders';

import type { TDeleteEntityProps } from './types';
import { OrderTable } from '@/conceptions/Orders';
import { Provider as OrdersProvider } from '@/context/orders';
import {
	useDeleteLoadingSelector,
	useListSelector
} from '@/context/products/useContext';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const [entities, setEntities] = useState<TOrder[] | undefined>(undefined);
	const { deleteEntity } = useDeleteEntityActions();
	const deleteEntityPending = useDeleteLoadingSelector();
	const listLoading = useListSelector();

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
		const found = listLoading.find(item => item.id === id);
		setEntities(found?.order ? [found.order] : undefined);
	}, [id, listLoading]);

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
