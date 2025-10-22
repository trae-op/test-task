import { memo } from 'react';

import styles from './Orders.module.scss';
import type { TOrderPriceProps } from './types';

const BLOCK = 'order-item';

export const OrderPrice = memo(({ price }: TOrderPriceProps) => {
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
