'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { GearFill } from 'react-bootstrap-icons';

import { CircleActionButton } from '@/components/CircleActionButton';
import { NavigationLink } from '@/components/NavigationLink';
import { Picture } from '@/components/Picture';

import { getProfileHref } from '@/utils/routing';

import styles from '../styles/Sidebar.module.scss';
import type { TSidebarProps } from '../types';

import { NavItem } from './NavItem';
import { useAvatarProfileSelector } from '@/context/global/useSelectors';

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
	const tReceipts = useTranslations('App');
	const avatarProfile = useAvatarProfileSelector();

	return (
		<div className={styles[BLOCK]}>
			<div className={styles[`${BLOCK}__profile`]}>
				<Picture
					src={avatarProfile || ''}
					alt='Ava'
					size='full'
					sizes='150px'
					priority
					className={styles[`${BLOCK}__avatar`]}
				/>

				<NavigationLink
					href={getProfileHref}
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
