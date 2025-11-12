'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { HeaderInfo } from './HeaderInfo';
import styles from './styles/TopHeader.module.scss';
import type { TTopHeaderProps } from './types';

const DateTimeDisplay = dynamic(
	() => import('./DateTimeDisplay').then(m => m.DateTimeDisplay),
	{ ssr: false }
);

export const TopHeader = memo(({ endContentComponent }: TTopHeaderProps) => {
	return (
		<div className={styles['top-header']}>
			<Container>
				<Row className={styles['top-header__row']}>
					<Col xs='auto' className={styles['top-header__col']}>
						<HeaderInfo />
					</Col>
					<Col xs='auto' className={styles['top-header__col']}>
						{endContentComponent}
						<DateTimeDisplay date={new Date()} />
					</Col>
				</Row>
			</Container>
		</div>
	);
});
