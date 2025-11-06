'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';

import { Button } from '@/components/Button';

import { useActions } from '@/hooks/settings/currency';

import {
	useDeleteLoadingSelector,
	useListSelector
} from '@/context/currency/useContext';

export const DeleteButton = ({ entityId }: { entityId: string }) => {
	const t = useTranslations('App');
	const idRef = useRef('');
	const items = useListSelector();
	const { deleteEntity } = useActions();
	const deletePending = useDeleteLoadingSelector();

	const handleDelete = useCallback((id: string) => {
		deleteEntity({ id });
		idRef.current = id;
	}, []);

	const onClick = useCallback(() => handleDelete(entityId), [entityId]);

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<Button
			text={t('Delete')}
			variant='danger'
			size='sm'
			isLoading={entityId === idRef.current && deletePending}
			disabled={entityId === idRef.current && deletePending}
			onClick={onClick}
		/>
	);
};
