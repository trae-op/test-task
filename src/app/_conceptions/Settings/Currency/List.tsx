'use client';

import { memo, useCallback, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

import { Button } from '@/components/Button';

import { useActions } from '@/hooks/settings/currency';

import {
	useDeleteLoadingSelector,
	useListSelector
} from '@/context/currency/useContext';

export const CurrencyList = memo(() => {
	const [id, setId] = useState('');
	const items = useListSelector();
	const { deleteEntity } = useActions();
	const deletePending = useDeleteLoadingSelector();

	const handleDelete = useCallback((id: string) => {
		deleteEntity({ id });
		setId(id);
	}, []);

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<ListGroup className='mb-3'>
			{items.map(item => {
				const onClick = () => handleDelete(item.id);
				return (
					<ListGroup.Item
						key={item.id}
						className='d-flex align-items-center justify-content-between'
					>
						<span>
							{item.title} ({item.value})
						</span>
						<Button
							text='Delete'
							variant='danger'
							size='sm'
							isLoading={item.id === id && deletePending}
							disabled={item.id === id && deletePending}
							onClick={onClick}
						/>
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
});
