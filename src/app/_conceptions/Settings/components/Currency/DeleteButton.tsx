'use client';

import clsx from 'clsx';
import { useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useFormStatus } from 'react-dom';

import { useListSelector } from '../../context/currency/useSelectors';
import { useActions } from '../../hooks/currency';

const DeleteEntity = () => {
	const { pending } = useFormStatus();

	return (
		<button
			aria-label='Delete currency'
			type='submit'
			disabled={pending}
			className={clsx(
				{
					['opacity-50']: pending
				},
				'd-flex align-items-center justify-content-center bg-danger p-3 border-0 rounded text-white'
			)}
			data-testid='settings-currency-delete-button'
		>
			{pending ? <Spinner animation='border' size='sm' /> : <Trash size={16} />}
		</button>
	);
};

export const DeleteButton = ({ entityId }: { entityId: string }) => {
	const items = useListSelector();
	const { deleteEntity } = useActions();

	const handleDelete = useCallback((id: string) => {
		deleteEntity(id);
	}, []);

	const deleteAction = useCallback(() => handleDelete(entityId), [entityId]);

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<form
			action={deleteAction}
			data-testid={`settings-currency-delete-form-${entityId}`}
		>
			<DeleteEntity />
		</form>
	);
};
