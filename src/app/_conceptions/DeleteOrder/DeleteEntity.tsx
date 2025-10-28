'use client';

import { memo, useCallback, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteOrder';

import { TProduct } from '@/types/products';

import type { TDeleteEntityProps } from './types';
import { ProductsTable } from '@/conceptions/Products';
import {
	useDeleteLoadingSelector,
	useListSelector
} from '@/context/orders/useContext';
import { Provider as ProductsProvider } from '@/context/products';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const [entities, setEntities] = useState<TProduct[] | undefined>(undefined);
	const { deleteEntity } = useDeleteEntityActions();
	const isDeleteLoading = useDeleteLoadingSelector();
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
		setEntities(found?.products || undefined);
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
				applyDisabled={isDeleteLoading}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			>
				{entities !== undefined && (
					<ProductsProvider>
						<ProductsTable isDeleteButton={false} items={entities} />
					</ProductsProvider>
				)}
			</Popup>
		</div>
	);
});
