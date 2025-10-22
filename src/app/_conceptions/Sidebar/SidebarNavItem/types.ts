import type { TSidebarNavItem } from '../types';

export type TSidebarNavItemProps = {
	item: TSidebarNavItem;
};

export type TNavItemProps = {
	isActive: boolean;
	text?: string;
};
