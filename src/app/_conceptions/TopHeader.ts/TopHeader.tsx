'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Container } from 'react-bootstrap';

import { Logo } from './Logo';
import styles from './styles/TopHeader.module.scss';
import type { TTopHeaderProps } from './types';

const DateTimeDisplay = dynamic(
	() => import('./DateTimeDisplay').then(m => m.DateTimeDisplay),
	{ ssr: false }
);

export const TopHeader = memo(({ startContentComponent }: TTopHeaderProps) => {
	return (
		<div className={styles['top-header']}>
			<div className={styles['top-header__row']}>
				<Logo />
				<div className={styles['top-header__col']}>
					{startContentComponent}
					<DateTimeDisplay date={new Date()} />
				</div>
			</div>
		</div>
	);
});
