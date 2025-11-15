'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/Button';

import { useListSelector } from '../../context/currency/useContext';
import { useActions } from '../../hooks/currency';

const DeleteEntity = () => {
	const t = useTranslations('App');
	const { pending } = useFormStatus();

	return (
		<Button
			variant='danger'
			text={t('Delete')}
			size='sm'
			type='submit'
			isLoading={pending}
			disabled={pending}
			data-testid='settings-currency-delete-button'
		/>
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
