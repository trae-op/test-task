'use client';

import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteProduct';

import type { TDeleteEntityProps } from './types';
import { useDeleteLoadingSelector } from '@/context/products/useContext';

export const DeleteEntity = memo(({ id }: TDeleteEntityProps) => {
	const { deleteEntity } = useDeleteEntityActions();
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

	return (
		<div className='d-flex align-items-center justify-content-center w-100 h-100'>
			<Popup
				componentButton={DeleteEntityButton}
				applyIconButton={Trash}
				iconButton={Trash}
				openButtonAriaLabel='Delete'
				applyText='Delete'
				applyDisabled={deleteEntityPending}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			/>
		</div>
	);
});
