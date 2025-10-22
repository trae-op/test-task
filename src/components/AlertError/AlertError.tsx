'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Card from 'react-bootstrap/Card';

import styles from './AlertError.module.scss';
import type { Props } from './types';

export const AlertError = ({ text }: Props) => {
	const t = useTranslations('App');
	return (
		<div className={clsx(styles['alert-error'])}>
			<Card className='w-50 mx-auto'>
				<Card.Body>
					<Card.Title>{t('Something wrong with server')}!!!</Card.Title>
					<Card.Text>{text}</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
