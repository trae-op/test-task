'use client';

import { memo, useMemo } from 'react';

import type { NavigationLinkProps } from './types';
import { Link, usePathname } from '@/i18n/navigation';

export const NavigationLink = memo(
	({ href, component: Component, text, ...rest }: NavigationLinkProps) => {
		const pathname = usePathname();

		const isActive = useMemo(() => {
			if (!pathname) return false;
			return pathname === href || pathname.startsWith(`${href}/`);
		}, [pathname, href]);

		if (!Component) {
			return (
				<Link href={href} {...rest}>
					{text}
				</Link>
			);
		}

		return (
			<Link href={href} {...rest}>
				<Component isActive={isActive} text={text} />
			</Link>
		);
	}
);
