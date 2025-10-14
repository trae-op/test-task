import { AddContent } from '@/components/AddContent';
import { Sidebar } from '@/components/Sidebar';
import type { TSidebarNavItem } from '@/components/Sidebar/types';
import { TopHeader } from '@/components/TopHeader.ts';

import styles from './Layout.module.scss';

const navigationItems: TSidebarNavItem[] = [
	{ href: '/orders', label: 'Receipts' },
	{ href: '/products', label: 'Products' }
];
export default async function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={styles['dashboard']}>
			<TopHeader />
			<div className={styles['dashboard__container']}>
				<Sidebar items={navigationItems} />
				<div className={styles['dashboard__content']}>
					<AddContent title='title' totalValue={40} />
					{children}
				</div>
			</div>
		</div>
	);
}
