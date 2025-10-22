'use client';

import { memo } from 'react';

import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import { getAddOrderHref } from '@/utils/routing/routing';

import styles from './AddEntity.module.scss';
import type { TAddEntityProps } from './types';

const BLOCK = 'add-entity';

export const AddEntity = memo(({ title, totalValue }: TAddEntityProps) => {
	return (
		<div className={styles[BLOCK]}>
			<NavigationLink href={getAddOrderHref()} component={AddEntityButton} />

			<div className={styles[`${BLOCK}__text`]}>
				<span>{title}</span>
				<span className={styles[`${BLOCK}__separator`]}>/</span>
				<span>{totalValue}</span>
			</div>
		</div>
	);
});
