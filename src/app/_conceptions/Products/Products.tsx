'use client';

import { clsx } from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { TProduct } from '@/types/products';

import { ProductRow } from './Product';
import styles from './Products.module.scss';
import type { TProductsProps } from './types';
import { useListSelector } from '@/context/entities';

const BLOCK = 'product-table';

export const ProductsTable = memo(
	({ isDetail = false, isDeleteButton, items: products }: TProductsProps) => {
		const itemsState = useListSelector<TProduct>();
		const items = products || itemsState;

		if (!items || items.length === 0) {
			return null;
		}

		return (
			<div
				className={clsx(styles['table-scroll-wrapper'], 'position-relative')}
			>
				<Table
					className={clsx(styles[BLOCK], 'mb-0', {
						[styles[`${BLOCK}--full-width`]]: !isDetail
					})}
					borderless
				>
					<tbody>
						{items.map(product => (
							<ProductRow
								key={product.id}
								isDeleteButton={isDeleteButton}
								isDetail={isDetail}
								{...product}
							/>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);
