import { clsx } from 'clsx';
import { memo, useMemo } from 'react';

import styles from './SidebarNavItem.module.scss';
import type { TNavItemProps } from './types';

export const NavItem = memo((props: TNavItemProps) => {
	const { text, isActive } = props;

	const navItemClass = useMemo(() => {
		return clsx(styles['nav-item'], {
			[styles['nav-item--active']]: isActive
		});
	}, [isActive]);

	return <span className={navItemClass}>{text}</span>;
});
