import { memo } from 'react';

import { AddEntityButton } from '@/components/ui/AddEntityButton';

import styles from './AddContent.module.scss';
import type { TAddContentProps } from './types';

const BLOCK = 'add-content';

export const AddContent = memo((props: TAddContentProps) => {
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
