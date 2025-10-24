'use client';

import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions } from '@/hooks/deleteOrder';

import type { TDeleteEntityProps } from './types';

export const DeleteEntity = memo(({ id, entityName }: TDeleteEntityProps) => {
	const { deleteEntity, pending } = useActions();
	const router = useRouter();

	const onDelete = useCallback(
		(onClose: () => void) => {
			deleteEntity({
				id,
				entityName,
				onSuccess: () => {
					onClose();
					router.refresh();
				}
			});
		},
		[id, entityName]
	);

	return (
		<div className='d-flex align-items-center justify-content-center w-100 h-100'>
			<Popup
				componentButton={DeleteEntityButton}
				applyIconButton={Trash}
				iconButton={Trash}
				openButtonAriaLabel='Delete'
				applyText='Delete'
				applyDisabled={pending}
				openButtonClassName='w-100 h-100'
				title='Delete this order?'
				applyButtonClassName=''
				onApply={onDelete}
			/>
		</div>
	);
});
