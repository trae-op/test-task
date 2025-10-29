import { getOrdersHref, getProductsHref } from '@/utils/routing/routing';

import styles from './Layout.module.scss';
import { AddEntity, Title as AddEntityTitle } from '@/conceptions/AddEntity';
import { LocalizationDropdown } from '@/conceptions/LocalizationDropdown';
import { Sidebar } from '@/conceptions/Sidebar';
import type { TSidebarNavItem } from '@/conceptions/Sidebar/types';
import { TopHeader } from '@/conceptions/TopHeader.ts';

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
				<div className={styles[`${BLOCK}__content`]}>
					<AddEntity
						addEntityHref={''}
						titleComponent={<AddEntityTitle title='Receipts' />}
						total={0}
					/>
					{children}
				</div>
			</div>
		</div>
	);
}
