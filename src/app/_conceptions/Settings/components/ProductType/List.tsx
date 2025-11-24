'use client';

import { memo } from 'react';
import { ListGroup } from 'react-bootstrap';

import { useListSelector } from '../../context/productType/useContext';

import { DeleteButton } from './DeleteButton';

export const ProductTypeList = memo(() => {
	const items = useListSelector();

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<ListGroup className='mb-3' data-testid='settings-product-type-list'>
			{items.map(item => (
				<ListGroup.Item
					key={item.id}
					className='d-flex align-items-center justify-content-between'
					data-testid={`settings-product-type-item-${item.id}`}
				>
					<span>{item.title}</span>
					<DeleteButton entityId={item.id} />
				</ListGroup.Item>
			))}
		</ListGroup>
	);
});
