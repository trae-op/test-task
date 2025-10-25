'use client';

import clsx from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { TOrder } from '@/types/orders';

import { OrderRow } from './Order';
import styles from './Orders.module.scss';
import type { TOrdersProps } from './types';
import { useListSelector } from '@/context/entities/useContext';

const BLOCK = 'order-table';

export const OrderTable = memo(
	({ isDetail = false, activeId, isDeleteButton }: TOrdersProps) => {
		const items = useListSelector<TOrder>();

		console.log('OrderTable items', items);

		if (!items || items.length === 0) {
			return null;
		}

		return (
			<div className={styles['table-scroll-wrapper']}>
				<Table
					className={clsx(styles[BLOCK], 'mb-0', {
						[styles[`${BLOCK}--full-width`]]: !isDetail
					})}
					borderless
				>
					<tbody>
						{items.map(item => (
							<OrderRow
								key={item.id}
								isActive={activeId ? item.id === activeId : false}
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
