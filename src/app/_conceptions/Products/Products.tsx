'use client';

import { clsx } from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { EmptyData } from '@/components/EmptyData/EmptyData';

import { ProductRow } from './Product';
import styles from './Products.module.scss';
import type { TProductsProps } from './types';
import { useListSelector } from '@/context/products/useContext';

const BLOCK = 'product-table';

export const ProductsTable = memo(
	({ isDetail = false, isDeleteButton, items: products }: TProductsProps) => {
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
