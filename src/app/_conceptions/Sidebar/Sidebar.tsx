'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { GearFill } from 'react-bootstrap-icons';

import { CircleActionButton } from '@/components/CircleActionButton';
import { NavigationLink } from '@/components/NavigationLink';
import { Picture } from '@/components/Picture';

import { getProfileHref } from '@/utils/routing';

import styles from './Sidebar.module.scss';
import { NavItem } from './SidebarNavItem';
import type { TSidebarProps } from './types';

const BLOCK = 'sidebar';

const ProfileSettingsButton = () => (
	<CircleActionButton
		Icon={GearFill}
		className={clsx(styles[`${BLOCK}__settings-button`], 'z-3')}
		iconClassName={styles[`${BLOCK}__settings-button-icon`]}
		aria-label='settings'
	/>
);

export const Sidebar = memo(({ items }: TSidebarProps) => {
	const tReceipts = useTranslations('App.sidebar');

	return (
		<div className={styles[BLOCK]}>
			<div className={styles[`${BLOCK}__profile`]}>
				<Picture
					src='https://placehold.co/600x400/000000/FFFFFF.png'
					alt='Ava'
					size='full'
					sizes='150px'
					priority
					className={styles[`${BLOCK}__avatar`]}
				/>

				<NavigationLink
					href={getProfileHref()}
					component={ProfileSettingsButton}
				/>
			</div>
			<nav className={styles[`${BLOCK}__nav`]}>
				{items.map(({ href, label }) => (
					<NavigationLink
						key={label}
						href={href}
						text={tReceipts(label)}
						component={NavItem}
					/>
				))}
			</nav>
		</div>
	);
});
