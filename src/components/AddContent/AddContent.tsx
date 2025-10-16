import { memo } from 'react';
import { PlusLg } from 'react-bootstrap-icons';

import styles from './AddContent.module.scss';
import type { TAddContentProps } from './types';
import { AddContentButton } from '@/ui-components/AddContentButton';

export const AddContent = memo((props: TAddContentProps) => {
	const { title, totalValue } = props;

	return (
		<div className={styles['add-content']}>
			<AddContentButton aria-label='add content' />

			<div className={styles['add-content__text']}>
				<span>{title}</span>
				<span className={styles['add-content__separator']}>/</span>
				<span>{totalValue}</span>
			</div>
		</div>
	);
});
