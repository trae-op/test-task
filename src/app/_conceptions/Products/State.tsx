import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

import styles from './Products.module.scss';
import type { TProductStateProps } from './types';

const BLOCK = 'product-item';

export const ProductState = memo(({ isNew }: TProductStateProps) => {
	const t = useTranslations('App.products.state');
	return (
		<div className={clsx(styles[`${BLOCK}__state`], 'w-50')}>
			{isNew === 1 ? (
				<span className={styles[`${BLOCK}__state-new`]}>{t('available')}</span>
			) : (
				<span className={styles[`${BLOCK}__state-used`]}>{t('inRepair')}</span>
			)}
		</div>
	);
});
