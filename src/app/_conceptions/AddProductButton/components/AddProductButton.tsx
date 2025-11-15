'use client';

import { useTranslations } from 'next-intl';
import { PlusLg } from 'react-bootstrap-icons';

import { NavigationLink } from '@/components/NavigationLink';

import { getAddProductHref } from '@/utils/routing/routing';

import styles from '../styles/AddProductButton.module.scss';

const BLOCK = 'add-product-button';

function NavigationLinkIcon() {
	return <PlusLg className={styles[`${BLOCK}__icon`]} size={20} />;
}

export const AddProductButton = () => {
	const t = useTranslations('App');

	return (
		<div className='d-flex align-items-center justify-content-start gap-2'>
			<NavigationLink
				className='d-flex'
				href={getAddProductHref}
				component={NavigationLinkIcon}
			/>
			<span>{t('Add product')}</span>
		</div>
	);
};
