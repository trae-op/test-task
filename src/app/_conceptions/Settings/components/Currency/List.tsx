'use client';

import { memo } from 'react';
import { ListGroup } from 'react-bootstrap';

import { useListSelector } from '../../context/currency/useContext';

import { DeleteButton } from './DeleteButton';

export const CurrencyList = memo(() => {
	const items = useListSelector();

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<ListGroup className='mb-3' data-testid='settings-currency-list'>
			{items.map(item => {
				return (
					<ListGroup.Item
						key={item.id}
						className='d-flex align-items-center justify-content-between'
						data-testid={`settings-currency-item-${item.id}`}
					>
						<span>
							{item.title} ({item.value})
						</span>
						<DeleteButton entityId={item.id} />
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
});
