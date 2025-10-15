import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { OrderRow } from './Order';
import styles from './Orders.module.scss';
import { TOrdersProps } from './types';

export const OrderTable = memo(({ items }: TOrdersProps) => {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<div className={styles['table-scroll-wrapper']}>
			<Table className={styles['order-table']} borderless>
				<tbody>
					{items.map(item => (
						<OrderRow key={item.id} {...item} />
					))}
				</tbody>
			</Table>
		</div>
	);
});
