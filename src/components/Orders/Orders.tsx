import { memo, useMemo } from 'react';
import Table from 'react-bootstrap/Table';

import { OrderRow } from './Order';
import styles from './Orders.module.scss';
import { TOrdersProps } from './types';

export const OrderTable = memo((props: TOrdersProps) => {
	const { items } = props;

	const itemsToRender = useMemo(() => {
		return items;
	}, [items]);

	if (!itemsToRender || itemsToRender.length === 0) {
		return null;
	}

	return (
		<div className={styles['table-scroll-wrapper']}>
			<Table className={styles['order-table']} borderless>
				<tbody>
					{itemsToRender.map(item => (
						<OrderRow key={item.id} data={item} />
					))}
				</tbody>
			</Table>
		</div>
	);
});
