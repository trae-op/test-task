import { memo } from 'react';

import styles from './Products.module.scss';
import type { TProductPriceProps } from './types';

const BLOCK = 'product-item';

export const ProductPrice = memo(({ price }: TProductPriceProps) => {
	return (
		<div className={styles[`${BLOCK}__price`]}>
			{price.map(({ symbol, isDefault, value }) => {
				if (isDefault === 0) {
					return (
						<span
							className={styles[`${BLOCK}__price-not-default`]}
							key={symbol}
						>
							{value} {symbol}
						</span>
					);
				}

				return (
					<span key={symbol}>
						{value} {symbol}
					</span>
				);
			})}
		</div>
	);
});
