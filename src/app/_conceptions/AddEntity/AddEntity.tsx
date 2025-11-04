'use client';

import { useParams, usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { AddEntityButton } from '@/components/AddEntityButton';
import { NavigationLink } from '@/components/NavigationLink';

import { TDynamicPageParams } from '@/types/dynamicPage';

import {
	getAddOrderHref,
	getAddProductHref,
	getOrderUpdateHref,
	getProductUpdateHref,
	getProfileHref,
	getWithoutLocalePath
} from '@/utils/routing';

import styles from './AddEntity.module.scss';
import { Title as AddEntityTitle } from './Title';
import {
	useEntitiesTotalSelector,
	useLinkAddEntitySelector
} from '@/context/global/useContext';

const BLOCK = 'add-entity';

export const AddEntity = ({ children }: PropsWithChildren) => {
	const totalFromContext = useEntitiesTotalSelector();
	const linkAddEntityFromContext = useLinkAddEntitySelector();

	const pathname = usePathname();
	const params = useParams<TDynamicPageParams>();
	const paths = [
		getAddOrderHref,
		getAddProductHref,
		getProfileHref,
		...(params.id ? [getProductUpdateHref(params.id)] : []),
		...(params.id ? [getOrderUpdateHref(params.id)] : [])
	];

	const withoutLocalePath = getWithoutLocalePath(pathname);

	const shouldHide = paths.some(path => withoutLocalePath === path);
	if (shouldHide) {
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

			{children}
		</div>
	);
};
