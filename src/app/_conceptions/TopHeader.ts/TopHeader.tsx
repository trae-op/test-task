'use client';

import { memo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { DateTimeDisplay } from './DateTimeDisplay';
import { HeaderInfo } from './HeaderInfo';
import styles from './styles/TopHeader.module.scss';
import type { TTopHeaderProps } from './types';

export const TopHeader = memo(({ endContentComponent }: TTopHeaderProps) => {
	const [currentDate] = useState(new Date());

	return (
		<div className={styles['top-header']}>
			<Container>
				<Row className={styles['top-header__row']}>
					<Col xs='auto' className={styles['top-header__col']}>
						<HeaderInfo title='INVENTORY' />
					</Col>
					<Col xs='auto' className={styles['top-header__col']}>
						{endContentComponent}
						<DateTimeDisplay date={currentDate} />
					</Col>
				</Row>
			</Container>
		</div>
	);
});
