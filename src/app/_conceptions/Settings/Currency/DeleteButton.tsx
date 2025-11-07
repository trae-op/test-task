'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/Button';

import { useActions } from '@/hooks/settings/currency';

import { useListSelector } from '@/context/currency/useContext';

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
		<form action={deleteAction}>
			<DeleteEntity />
		</form>
	);
};
