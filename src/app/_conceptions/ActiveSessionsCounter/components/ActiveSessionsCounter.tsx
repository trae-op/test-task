'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Spinner } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';

import {
	useActiveSessionsCountSelector,
	useActiveSessionsStatusSelector
} from '../context/activeSessions';
import styles from '../styles/ActiveSessionsCounter.module.scss';

const BLOCK = 'active-sessions';

export const ActiveSessionsCounter = () => {
	const t = useTranslations('App');
	const count = useActiveSessionsCountSelector();
	const status = useActiveSessionsStatusSelector();
	const isError = status === 'error';
	const isConnecting = status === 'connecting';

	return (
		<div className={styles[BLOCK]} data-testid='active-sessions-counter'>
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
				data-testid='active-sessions-status'
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
						data-testid='active-sessions-spinner'
					/>
				)}

				{!isConnecting && !isError && `${t('Active sessions')}: ${count}`}
			</span>
		</div>
	);
};
