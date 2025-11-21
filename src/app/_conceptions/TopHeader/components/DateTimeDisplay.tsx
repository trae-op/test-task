'use client';

import { useLocale } from 'next-intl';
import { memo, useCallback } from 'react';

import { formatDateTime } from '@/utils/dateTime';

import styles from '../styles/DateTimeDisplay.module.scss';
import type { TDateTimeDisplayProps } from '../types';

const BLOCK = 'date-time';

const DateTimeDisplay = memo(({ date }: TDateTimeDisplayProps) => {
	const i18nLocale = useLocale();
	const dateTime = useCallback(
		(formatString: string) =>
			formatDateTime({
				dateString: date,
				i18nLocale,
				formatString
			}),
		[date, i18nLocale]
	);

	return (
		<div className={styles[BLOCK]}>
			<div className={styles[`${BLOCK}__label`]}>{dateTime('EEEE')}</div>
			<div className={styles[`${BLOCK}__wrapper`]}>
				<span className={styles[`${BLOCK}__date`]}>
					{dateTime('dd MMM, yyyy')}
				</span>
				<div className={styles[`${BLOCK}__time-wrapper`]}>
					<div className={styles[`${BLOCK}__clock-container-icon`]}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='13'
							height='14'
							fill='none'
							stroke='currentColor'
							strokeWidth='1'
							className='bi bi-clock'
							viewBox='-0.5 0.3 17 16'
						>
							<path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z' />
							<path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0' />
						</svg>
					</div>
					<span className={styles[`${BLOCK}__time`]}>{dateTime('HH:mm')}</span>
				</div>
			</div>
		</div>
	);
});

export { DateTimeDisplay };
