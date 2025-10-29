'use client';

import { usePathname } from 'next/navigation';

import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import { getAddOrderHref, getAddProductHref } from '@/utils/routing';

import styles from './AddEntity.module.scss';
import { Title as AddEntityTitle } from './Title';
import {
	useEntitiesTotalSelector,
	useLinkAddEntitySelector
} from '@/context/global/useContext';

const BLOCK = 'add-entity';

export const AddEntity = () => {
	const totalFromContext = useEntitiesTotalSelector();
	const linkAddEntityFromContext = useLinkAddEntitySelector();

	const pathname = usePathname();

	const normalizedPath = pathname.replace(/^\/[a-zA-Z]{2}\//, '/');
	if (
		normalizedPath === getAddOrderHref ||
		normalizedPath === getAddProductHref
	) {
		return null;
	}

	return (
		<div className={styles[BLOCK]}>
			<NavigationLink
				href={linkAddEntityFromContext || ''}
				component={AddEntityButton}
				aria-label='add entity'
				text='Entities'
			/>

			<div className={styles[`${BLOCK}__text`]}>
				<AddEntityTitle />
				<span className={styles[`${BLOCK}__separator`]}>/</span>
				<span>{totalFromContext || 0}</span>
			</div>
		</div>
	);
};
