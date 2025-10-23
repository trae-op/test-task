import { getOrdersHref, getProductsHref } from '@/utils/routing/routing';

import styles from './Layout.module.scss';
import { LocalizationDropdown } from '@/app/_conceptions/LocalizationDropdown';
import { Sidebar } from '@/app/_conceptions/Sidebar';
import type { TSidebarNavItem } from '@/app/_conceptions/Sidebar/types';
import { TopHeader } from '@/app/_conceptions/TopHeader.ts';

const navigationItems: TSidebarNavItem[] = [
	{ href: getOrdersHref, label: 'Receipts' },
	{ href: getProductsHref, label: 'Products' }
];
const BLOCK = 'dashboard';

export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={styles[BLOCK]}>
			<TopHeader
				endContentComponent={<LocalizationDropdown className='me-2' />}
			/>
			<div className={styles[`${BLOCK}__container`]}>
				<Sidebar items={navigationItems} />
				<div className={styles[`${BLOCK}__content`]}>{children}</div>
			</div>
		</div>
	);
}
