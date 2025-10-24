'use client';

import { useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Popup } from '@/components/Popup/Popup';

import { useActions as useDeleteEntityActions } from '@/hooks/deleteEntity';
import { useActions as useGetEntitiesActions } from '@/hooks/getEntities';

import type { TDeleteEntityProps } from './types';

export const DeleteEntity = memo(
	({
		id,
		entityName,
		entityTableComponent: EntityTableComponent
	}: TDeleteEntityProps) => {
		const [entities, setEntities] = useState<[] | undefined>(undefined);
		const { deleteEntity, pending: deleteEntityPending } =
			useDeleteEntityActions();
		const { getEntity, pending: entityPending } = useGetEntitiesActions();
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

		const onOpen = useCallback(() => {
			getEntity({
				entityId: id,
				entityName,
				onSuccess: response => {
					const isArray = Array.isArray(response.results.items);
					if (response.results.items !== undefined && isArray) {
						setEntities(response.results.items);
					}
				}
			});
		}, [id, entityName]);

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
						<Placeholder animation='glow' className='w-100 '>
							<Placeholder className='w-100 my-1' style={{ height: '4rem' }} />
						</Placeholder>
					)}
					{EntityTableComponent !== undefined && (
						<EntityTableComponent
							items={entities || []}
							isDetail
							isDeleteButton={false}
						/>
					)}
				</Popup>
			</div>
		);
	}
);
