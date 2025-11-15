'use client';

import { useLocale } from 'next-intl';
import { memo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import type { TProps } from '../types';

import { Link, usePathname } from '@/i18n/navigation';

export const LocalizationDropdown = memo(({ className }: TProps) => {
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<Dropdown className={className} align='end'>
			<Dropdown.Toggle id='dropdown-localization' variant='success' size='sm'>
				{locale.toUpperCase()}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item as={Link} href={pathname} locale='en'>
					<span className='text-uppercase'>en</span>
				</Dropdown.Item>
				<Dropdown.Item as={Link} href={pathname} locale='uk'>
					<span className='text-uppercase'>uk</span>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
});
