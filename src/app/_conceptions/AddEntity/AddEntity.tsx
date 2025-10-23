import { getTranslations } from 'next-intl/server';

import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import styles from './AddEntity.module.scss';
import type { TAddEntityProps } from './types';

const BLOCK = 'add-entity';

export const AddEntity = async ({
	title,
	total,
	addEntityHref
}: TAddEntityProps) => {
	const t = await getTranslations('App');

	return (
		<div className={styles[BLOCK]}>
			<NavigationLink
				href={addEntityHref}
				component={AddEntityButton}
				aria-label='add entity'
			/>

			<div className={styles[`${BLOCK}__text`]}>
				<span>{t(title)}</span>
				<span className={styles[`${BLOCK}__separator`]}>/</span>
				<span>{total}</span>
			</div>
		</div>
	);
};
