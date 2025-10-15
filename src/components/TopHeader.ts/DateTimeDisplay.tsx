import { useLocale } from 'next-intl';
import { memo, useCallback } from 'react';
import { Clock } from 'react-bootstrap-icons';

import { formatDateTime } from '@/utils/dateTime';

import styles from './styles/DateTimeDisplay.module.scss';
import type { TDateTimeDisplayProps } from './types';

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
						<Clock className={styles[`${BLOCK}__clock-icon`]} size={13} />
					</div>
					<span className={styles[`${BLOCK}__time`]}>{dateTime('HH:mm')}</span>
				</div>
			</div>
		</div>
	);
});

export { DateTimeDisplay };
