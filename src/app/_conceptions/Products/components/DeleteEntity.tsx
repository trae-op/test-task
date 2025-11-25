'use client';

import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useDeleteLoadingSelector } from '../context/useSelectors';
import { useActions as useDeleteEntityActions } from '../hooks';
import type { TDeleteEntityProps } from '../types';

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
		<div className='d-flex align-items-center justify-content-center h-100'>
			<Popup
				componentButton={DeleteEntityButton}
				applyIconButton={Trash}
				iconButton={Trash}
				openButtonAriaLabel='Delete'
				applyText='Delete'
				isLoading={deleteEntityPending}
				openButtonClassName='w-100 h-100'
				title='Delete this product?'
				applyButtonClassName=''
				onApply={onDelete}
			/>
		</div>
	);
});
