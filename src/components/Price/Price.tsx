import { memo } from 'react';

import styles from './Price.module.scss';
import type { TPriceProps } from './types';
import { useAdaptiveTableSelector } from '@/context/orders/useContext';

const BLOCK = 'price';

export const Price = memo(({ prices }: TPriceProps) => {
	const hasAdaptiveTable = useAdaptiveTableSelector();

	if (!hasAdaptiveTable && (prices === undefined || prices.length === 0)) {
		return (
			<div className={styles[BLOCK]}>
				<span className='fs-1'>-</span>
			</div>
		);
	}

	if (prices === undefined || prices.length === 0) {
		return null;
	}

	return (
		<div className={styles[BLOCK]}>
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
