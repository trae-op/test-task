import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

import type { TProductStateProps } from '../types';

import styles from './styles/Products.module.scss';

const BLOCK = 'product-item';

export const ProductState = memo(({ isNew }: TProductStateProps) => {
	const t = useTranslations('App');

	if (isNew === undefined) {
		return null;
	}

	return (
		<div className={clsx(styles[`${BLOCK}__state`], 'w-50 text-center')}>
			{isNew ? (
				<span className={styles[`${BLOCK}__state-new`]}>{t('Available')}</span>
			) : (
				<span className={styles[`${BLOCK}__state-used`]}>
					{t('Not available')}
				</span>
			)}
		</div>
	);
});
