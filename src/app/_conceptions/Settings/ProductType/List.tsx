'use client';

import { memo, useCallback, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

import { Button } from '@/components/Button';

import { useActions } from '@/hooks/settings/productType';

import {
	useDeleteLoadingSelector,
	useListSelector
} from '@/context/productType/useContext';

export const ProductTypeList = memo(() => {
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
			{items.map(item => (
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
						onClick={() => handleDelete(item.id)}
					/>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
});
