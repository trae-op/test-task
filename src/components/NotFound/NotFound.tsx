'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Card from 'react-bootstrap/Card';

import styles from './NotFound.module.scss';

export const NotFound = ({ text }: { text: string }) => {
	const t = useTranslations('App');
	return (
		<div className={clsx(styles['not-found'])}>
			<Card style={{ width: '18rem' }}>
				<Card.Body>
					<Card.Title>{t('Not Found')}</Card.Title>
					<Card.Text>{t(text)}</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
