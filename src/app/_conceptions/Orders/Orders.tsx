'use client';

import clsx from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { EmptyData } from '@/components/EmptyData';

import { OrderRow } from './Order';
import styles from './Orders.module.scss';
import type { TOrdersProps } from './types';
import { useListSelector } from '@/context/orders/useContext';
import { useEntityIdSelector } from '@/context/orders/useContext';

const BLOCK = 'order-table';

export const OrderTable = memo(
	({ isDeleteButton, items: orders }: TOrdersProps) => {
		const itemsState = useListSelector();
		const entityId = useEntityIdSelector();
		const items = orders || itemsState;

		if (!items || items.length === 0) {
			<EmptyData text='Could not find any orders' />;
		}

		return (
			<div className={styles['table-scroll-wrapper']}>
				<Table
					className={clsx(styles[BLOCK], 'mb-0', {
						[styles[`${BLOCK}--full-width`]]: !entityId
					})}
					borderless
				>
					<tbody>
						{items.map(item => (
							<OrderRow
								key={item.id}
								isDeleteButton={isDeleteButton}
								{...item}
							/>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);
