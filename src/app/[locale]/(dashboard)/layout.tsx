import { DropdownLocalization } from '@/components/DropdownLocalization';
import { Sidebar } from '@/components/Sidebar';
import type { TSidebarNavItem } from '@/components/Sidebar/types';
import { TopHeader } from '@/components/TopHeader.ts';

import styles from './Layout.module.scss';
import { AddEntity } from '@/app/_conceptions/AddEntity';

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
				endContentComponent={<DropdownLocalization className='me-2' />}
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
