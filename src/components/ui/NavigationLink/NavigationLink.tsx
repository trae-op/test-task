'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { memo, useMemo } from 'react';

import type { NavigationLinkProps } from './types';
import { Link } from '@/i18n/navigation';

export const NavigationLink = memo(
	({ href, component: Component, text, ...rest }: NavigationLinkProps) => {
		const selectedLayoutSegment = useSelectedLayoutSegment();

		const pathname = useMemo(
			() => (selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'),
			[selectedLayoutSegment]
		);

		const isActive = useMemo(() => pathname === href, [pathname, href]);

		return (
			<Link href={href} {...rest}>
				<Component isActive={isActive} text={text} />
			</Link>
		);
	}
);
