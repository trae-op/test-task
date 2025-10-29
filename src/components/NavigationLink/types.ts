import { ComponentProps, ComponentType } from 'react';

import { Link } from '@/i18n/navigation';

export type NavigationItemProps = {
	isActive: boolean;
	text?: string;
};

export type NavigationLinkProps = ComponentProps<typeof Link> &
	Pick<NavigationItemProps, 'text'> & {
		component?: ComponentType<NavigationItemProps>;
	};
