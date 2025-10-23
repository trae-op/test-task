import { memo } from 'react';

import styles from './Price.module.scss';
import type { TPriceProps } from './types';

const BLOCK = 'price';

export const Price = memo(({ prices }: TPriceProps) => {
	if (prices === undefined || prices.length === 0) {
		return null;
	}

	return (
		<div className={styles[BLOCK]}>
			{prices.map(({ symbol, isDefault, value }) => {
				if (!isDefault) {
					return (
						<span className={styles[`${BLOCK}__not-default`]} key={symbol}>
							{String(value)} {symbol}
						</span>
					);
				}

				return (
					<span key={symbol}>
						{String(value)} {symbol}
					</span>
				);
			})}
		</div>
	);
});
