'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Card from 'react-bootstrap/Card';

import styles from './AlertError.module.scss';
import type { Props } from './types';

const BLOCK = 'alert-error';

export const AlertError = ({ text }: Props) => {
	const t = useTranslations('App');
	return (
		<div className={styles[BLOCK]}>
			<Card className={styles[`${BLOCK}__card`]}>
				<Card.Body className={styles[`${BLOCK}__card-body`]}>
					<Card.Title>{t('Something wrong with server')}!!!</Card.Title>
					<Card.Text>{text}</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
