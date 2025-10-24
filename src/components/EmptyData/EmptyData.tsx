'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Card from 'react-bootstrap/Card';

import styles from './EmptyData.module.scss';

export const EmptyData = ({
	text = 'No data available'
}: {
	text?: string;
}) => {
	const t = useTranslations('App');
	return (
		<div className={clsx(styles['empty-data'])}>
			<Card style={{ width: '18rem' }}>
				<Card.Body>
					<Card.Title>{t('No data')}</Card.Title>
					<Card.Text>{t(text)}</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
