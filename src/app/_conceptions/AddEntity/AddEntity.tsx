import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import styles from './AddEntity.module.scss';
import type { TAddEntityProps } from './types';

const BLOCK = 'add-entity';

export const AddEntity = ({
	total,
	addEntityHref,
	titleComponent
}: TAddEntityProps) => (
	<div className={styles[BLOCK]}>
		<NavigationLink
			href={addEntityHref}
			component={AddEntityButton}
			aria-label='add entity'
			text='Receipts'
		/>

		<div className={styles[`${BLOCK}__text`]}>
			{titleComponent}
			<span className={styles[`${BLOCK}__separator`]}>/</span>
			<span>{total}</span>
		</div>
	</div>
);
