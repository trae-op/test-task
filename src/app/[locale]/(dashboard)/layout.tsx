import styles from './Layout.module.scss';
import { AddEntity } from '@/app/_conceptions/AddEntity';
import { LocalizationDropdown } from '@/app/_conceptions/LocalizationDropdown';
import { Sidebar } from '@/app/_conceptions/Sidebar';
import type { TSidebarNavItem } from '@/app/_conceptions/Sidebar/types';
import { TopHeader } from '@/app/_conceptions/TopHeader.ts';

const navigationItems: TSidebarNavItem[] = [
	{ href: '/orders', label: 'Receipts' },
	{ href: '/products', label: 'Products' }
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
					<AddEntity title='title' totalValue={40} />
					<div className='mt-4'>{children}</div>
				</div>
			</div>
		</div>
	);
}
