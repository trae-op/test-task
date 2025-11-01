'use client';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useState } from 'react';
import { GearFill } from 'react-bootstrap-icons';

import { CircleActionButton } from '@/components/CircleActionButton';
import { NavigationLink } from '@/components/NavigationLink';
import { Picture } from '@/components/Picture';

import { getProfileHref } from '@/utils/routing';
import { getFullPathUploadPicture } from '@/utils/upload-files';

import styles from './Sidebar.module.scss';
import { NavItem } from './SidebarNavItem';
import type { TSidebarProps } from './types';
import { useAvatarProfileSelector } from '@/context/global/useContext';

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
	const { data: session } = useSession();
	const tReceipts = useTranslations('App.sidebar');
	const avatarProfile = useAvatarProfileSelector();

	const [imageKey, setImageKey] = useState(0);
	useEffect(() => {
		const timer = setInterval(() => {
			setImageKey(prev => prev + 1);
		}, 5000);

		return () => clearInterval(timer);
	}, []);

	if (!session) {
		return null;
	}

	console.log('Sidebar avatarProfile', `${avatarProfile}&v=${Date.now()}`);

	return (
		<div className={styles[BLOCK]}>
			<div className={styles[`${BLOCK}__profile`]}>
				<Picture
					src={
						avatarProfile
							? `${avatarProfile}&v=${imageKey}`
							: getFullPathUploadPicture({
									id: session.user.id,
									name: session.user.image || ''
								})
					}
					alt='Ava'
					size='full'
					sizes='150px'
					priority
					unoptimized
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
