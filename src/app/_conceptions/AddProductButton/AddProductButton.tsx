'use client';

import { useTranslations } from 'next-intl';
import { PlusLg } from 'react-bootstrap-icons';

import { NavigationLink } from '@/components/NavigationLink';

import { getAddProductHref } from '@/utils/routing/routing';

import styles from './AddProductButton.module.scss';

const BLOCK = 'add-product-button';

function NavigationLinkIcon() {
	return <PlusLg className={styles[`${BLOCK}__icon`]} size={20} />;
}

export const AddProductButton = () => {
	const t = useTranslations('App.addProduct');

	return (
		<div className='d-flex align-items-center justify-content-start gap-2'>
			<NavigationLink
				href={getAddProductHref()}
				component={NavigationLinkIcon}
			/>
			<span>{t('title')}</span>
		</div>
	);
};
