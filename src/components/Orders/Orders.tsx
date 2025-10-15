'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import type { TDynamicPageParams } from '@/types/dynamicPage';

import { OrderRow } from './Order';
import styles from './Orders.module.scss';
import type { TOrdersProps } from './types';

const BLOCK = 'order-table';

export const OrderTable = memo(({ items, isDetail = false }: TOrdersProps) => {
	const { id } = useParams<TDynamicPageParams>();
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
							isActive={item.id === id}
							isDeleteButton={!id}
							{...item}
						/>
					))}
				</tbody>
			</Table>
		</div>
	);
});
