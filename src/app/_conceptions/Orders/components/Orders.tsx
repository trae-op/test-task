'use client';

import clsx from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { EmptyData } from '@/components/EmptyData';

import { useListSelector } from '../context/useSelectors';
import { useAdaptiveTableSelector } from '../context/useSelectors';
import styles from '../styles/Orders.module.scss';
import type { TOrdersProps } from '../types';

import { OrderRow } from './Order';

const BLOCK = 'order-table';

export const OrderTable = memo(
	({ isDeleteButton, isUpdateButton, items: orders }: TOrdersProps) => {
		const itemsState = useListSelector();
		const hasAdaptiveTable = useAdaptiveTableSelector();
		const items = orders || itemsState;

		if (!items || items.length === 0) {
			return <EmptyData text='No orders available' />;
		}

		return (
			<div className={styles['table-scroll-wrapper']}>
				<Table
					className={clsx(styles[BLOCK], 'mb-0', {
						[styles[`${BLOCK}--full-width`]]: !hasAdaptiveTable
					})}
					borderless
				>
					<tbody>
						{items.map(item => (
							<OrderRow
								{...item}
								key={item.id}
								prices={item.prices}
								isDeleteButton={isDeleteButton}
								isUpdateButton={isUpdateButton}
							/>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);
