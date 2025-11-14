export type TSidebarNavItem = {
	href: string;
	label: string;
};

export type TSidebarProps = {
	items: TSidebarNavItem[];
};

export type TSidebarNavItemProps = {
	item: TSidebarNavItem;
};

export type TNavItemProps = {
	isActive: boolean;
	text?: string;
};
