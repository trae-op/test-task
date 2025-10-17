import { memo } from 'react';

import { AddEntityButton } from '@/components/ui/AddEntityButton';

import styles from './AddEntity.module.scss';
import type { TAddEntityProps } from './types';

const BLOCK = 'add-entity';

export const AddEntity = memo((props: TAddEntityProps) => {
	const { title, totalValue } = props;

	return (
		<div className={styles[BLOCK]}>
			<AddEntityButton aria-label='add content' />

			<div className={styles[`${BLOCK}__text`]}>
				<span>{title}</span>
				<span className={styles[`${BLOCK}__separator`]}>/</span>
				<span>{totalValue}</span>
			</div>
		</div>
	);
});
