'use client';

import { useTranslations } from 'next-intl';

import styles from './AddEntity.module.scss';
import type { TTitleProps } from './types';

const BLOCK = 'add-entity';

export const Title = ({ title, total }: TTitleProps) => {
	const t = useTranslations('App');

	return (
		<div className={styles[`${BLOCK}__text`]}>
			<span>{t(title)}</span>
			<span className={styles[`${BLOCK}__separator`]}>/</span>
			<span>{total}</span>
		</div>
	);
};
