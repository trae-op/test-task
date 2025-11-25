'use client';

import { clsx } from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { EmptyData } from '@/components/EmptyData/EmptyData';

import { useListSelector } from '../context/useSelectors';
import { useAdaptiveTableSelector } from '../context/useSelectors';
import styles from '../styles/Products.module.scss';
import type { TProductsProps } from '../types';

import { ProductRow } from './Product';

const BLOCK = 'product-table';

export const ProductsTable = memo(
	({ isDeleteButton, items: products }: TProductsProps) => {
		const hasAdaptiveTable = useAdaptiveTableSelector();
		const itemsState = useListSelector();
		const items = products || itemsState;

		if (!items || items.length === 0) {
			return <EmptyData text='Could not find any products' />;
		}

		return (
			<div
				className={clsx(styles['table-scroll-wrapper'], 'position-relative')}
			>
				<Table
					className={clsx(styles[BLOCK], 'mb-0', {
						[styles[`${BLOCK}--full-width`]]: !hasAdaptiveTable
					})}
					borderless
				>
					<tbody>
						{items.map(product => (
							<ProductRow
								key={product.id}
								isDeleteButton={isDeleteButton}
								{...product}
							/>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);
