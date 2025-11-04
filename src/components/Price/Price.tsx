import clsx from 'clsx';
import { memo } from 'react';

import styles from './Price.module.scss';
import type { TPriceProps } from './types';

const BLOCK = 'price';

export const Price = memo(({ prices, hasAdaptiveTable }: TPriceProps) => {
	if (!hasAdaptiveTable && (prices === undefined || prices.length === 0)) {
		return (
			<div className={clsx(styles[BLOCK], 'w-50')}>
				<span className='fs-1'>-</span>
			</div>
		);
	}

	if (prices === undefined || prices.length === 0) {
		return null;
	}

	return (
		<div className={clsx(styles[BLOCK], 'w-50')}>
			{prices.map(({ symbol, isDefault, value }) => {
				if (!isDefault) {
					return (
						<span className={styles[`${BLOCK}__not-default`]} key={symbol}>
							{value} {symbol}
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
