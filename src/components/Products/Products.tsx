import { clsx } from 'clsx';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { ProductRow } from './Product';
import styles from './Products.module.scss';
import type { TProductsProps } from './types';

const BLOCK = 'product-table';

export const ProductsTable = memo(
	({ items, isDetail = false }: TProductsProps) => {
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
						{items.map(product => (
							<ProductRow key={product.id} isDetail={isDetail} {...product} />
						))}
					</tbody>
				</Table>
			</div>
		);
	}
);
