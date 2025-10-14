import { memo } from 'react';

import styles from './Products.module.scss';
import type { TProductStateProps } from './types';

const BLOCK = 'product-item';

export const ProductState = memo(({ isNew }: TProductStateProps) => {
	return (
		<div className={styles[`${BLOCK}__state`]}>
			{isNew === 1 ? (
				<span className={styles[`${BLOCK}__state-new`]}>Available</span>
			) : (
				<span className={styles[`${BLOCK}__state-used`]}>In Repair</span>
			)}
		</div>
	);
});
