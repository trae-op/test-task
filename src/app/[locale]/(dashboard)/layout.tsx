import { TDynamicPageProps } from '@/types/dynamicPage';

import {
	getAddOrderHref,
	getAddProductHref,
	getProductUpdateHref,
	getProfileHref
} from '@/utils/routing';
import { getOrdersHref, getProductsHref } from '@/utils/routing/routing';

import styles from './Layout.module.scss';
import { AddEntity } from '@/conceptions/AddEntity';
import { LocalizationDropdown } from '@/conceptions/LocalizationDropdown';
import { Sidebar } from '@/conceptions/Sidebar';
import type { TSidebarNavItem } from '@/conceptions/Sidebar/types';
import { TopHeader } from '@/conceptions/TopHeader.ts';
import { Provider as GlobalProvider } from '@/context/global';

const navigationItems: TSidebarNavItem[] = [
	{ href: getOrdersHref, label: 'Receipts' },
	{ href: getProductsHref, label: 'Products' }
];
const BLOCK = 'dashboard';

export default async function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={styles[BLOCK]}>
			<GlobalProvider>
				<TopHeader
					endContentComponent={<LocalizationDropdown className='me-2' />}
				/>
				<div className={styles[`${BLOCK}__container`]}>
					<Sidebar items={navigationItems} />
					<div className={styles[`${BLOCK}__content`]}>
						<AddEntity />

						{children}
					</div>
				</div>
			</GlobalProvider>
		</div>
	);
}
