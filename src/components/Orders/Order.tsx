import { uk } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { ListUl, Trash } from 'react-bootstrap-icons';

import { formatDateTime } from '@/utils/dateTime';

import styles from './Orders.module.scss';
import { OrderPrice } from './Price';
import { TOrderProps } from './types';

const BLOCK = 'order-item';

export const OrderRow = memo(
	({ title, productCount, date, price }: TOrderProps) => {
		const tp = useTranslations('App.products');

		const dateTime = useCallback(
			(formatString: string) =>
				formatDateTime({
					dateString: date,
					locale: uk,
					formatString
				}),
			[date]
		);

		return (
			<tr className={styles[BLOCK]}>
				<td className={styles[`${BLOCK}__content`]}>
					<div className={styles[`${BLOCK}__name`]} title={title}>
						{title}
					</div>
					<div className={styles[`${BLOCK}__details`]}>
						<div className={styles[`${BLOCK}__detail-item`]}>
							<div className={styles[`${BLOCK}__container-icon`]}>
								<ListUl className={styles[`${BLOCK}__icon`]} size={15} />
							</div>
							<div>
								<div className={styles[`${BLOCK}__count`]}>{productCount}</div>
								<div className={styles[`${BLOCK}__secondary-text`]}>
									{tp('Products')}
								</div>
							</div>
						</div>

						<div className={styles[`${BLOCK}__detail-item`]}>
							<div>
								<div className={styles[`${BLOCK}__primary-text`]}>
									{dateTime('dd / MM')}
								</div>
								<div className={styles[`${BLOCK}__secondary-text`]}>
									{dateTime('dd MMM yyyy')}
								</div>
							</div>
						</div>

						<OrderPrice price={price} />
					</div>
					<div className={styles[`${BLOCK}__delete-btn`]}>
						<Trash size={18} />
					</div>
				</td>
			</tr>
		);
	}
);
