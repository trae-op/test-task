'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Spinner } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';

import styles from './ActiveSessionsCounter.module.scss';
import {
	useActiveSessionsCountSelector,
	useActiveSessionsStatusSelector
} from '@/context/activeSessions';

const BLOCK = 'active-sessions';

export const ActiveSessionsCounter = () => {
	const t = useTranslations('App');
	const count = useActiveSessionsCountSelector();
	const status = useActiveSessionsStatusSelector();
	const isError = status === 'error';
	const isConnecting = status === 'connecting';

	return (
		<div className={styles[BLOCK]}>
			<PeopleFill
				aria-hidden
				className={clsx({
					['text-danger']: isError,
					['text-success']: !isError
				})}
				size={18}
			/>

			<span
				className={clsx(styles[`${BLOCK}__count`], {
					['text-danger']: isError,
					['text-success']: !isError
				})}
			>
				{isError && t('Connection error')}

				{isConnecting && (
					<Spinner
						className='ms-2'
						size='sm'
						animation='grow'
						variant='secondary'
						role='status'
						aria-live='polite'
					/>
				)}

				{!isConnecting && !isError && `${t('Active sessions')}: ${count}`}
			</span>
		</div>
	);
};
