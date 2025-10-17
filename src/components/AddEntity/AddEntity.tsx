'use client';

import { memo } from 'react';

import { AddEntityButton } from '@/components/ui/AddEntityButton';
import { Popup } from '@/components/ui/Popup';

import styles from './AddEntity.module.scss';
import type { TAddEntityProps } from './types';

const BLOCK = 'add-entity';

export const AddEntity = memo(({ title, totalValue }: TAddEntityProps) => {
	return (
		<div className={styles[BLOCK]}>
			<Popup
				componentButton={AddEntityButton}
				title={'Add this order?'}
				confirmText={'Add'}
				cancelText={'Cancel'}
				applyButtonClassName=''
				onApply={onClose => {
					console.log('add order');
					onClose();
				}}
			/>

			<div className={styles[`${BLOCK}__text`]}>
				<span>{title}</span>
				<span className={styles[`${BLOCK}__separator`]}>/</span>
				<span>{totalValue}</span>
			</div>
		</div>
	);
});
