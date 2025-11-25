'use client';

import { memo, useCallback, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup';

import { TProduct } from '@/types/products';

import {
	useDeleteLoadingSelector,
	useListSelector
} from '../context/useSelectors';
import { useActions as useDeleteEntityActions } from '../hooks';
import type { TDeleteEntityProps } from '../types';

import { ProductsByOrder } from './ProductsByOrder';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const [entities, setEntities] = useState<TProduct[] | undefined>(undefined);
	const { deleteEntity } = useDeleteEntityActions();
	const isDeleteLoading = useDeleteLoadingSelector();
	const orders = useListSelector();

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
		const found = orders.find(item => item.id === id);
		setEntities(found?.products || []);
	}, [id, orders]);

	return (
		<div className='d-flex align-items-center justify-content-center h-100'>
			<Popup
				componentButton={DeleteEntityButton}
				applyIconButton={Trash}
				iconButton={Trash}
				onOpen={onOpen}
				openButtonAriaLabel='Delete'
				applyText='Delete'
				isLoading={isDeleteLoading}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			>
				{entities !== undefined && entities.length > 0 && (
					<ProductsByOrder items={entities} />
				)}
			</Popup>
		</div>
	);
});
