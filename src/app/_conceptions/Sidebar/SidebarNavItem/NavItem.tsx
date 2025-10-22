import { clsx } from 'clsx';
import { memo } from 'react';

import styles from './SidebarNavItem.module.scss';
import type { TNavItemProps } from './types';

export const NavItem = memo(({ text, isActive }: TNavItemProps) => (
	<span
		className={clsx(styles['nav-item'], {
			[styles['nav-item--active']]: isActive
		})}
	>
		{text}
	</span>
));
