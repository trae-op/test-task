import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { ListUl } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';

import { formatDateTime } from '@/utils/dateTime';

import styles from './Orders.module.scss';
import { OrderPrice } from './Price';
import { TOrderProps } from './types';

const BLOCK = 'order-item';

export const OrderRow = memo(
	({
		title,
		date,
		price,
		products,
		id,
		isDeleteButton = true
	}: TOrderProps) => {
		const i18nLocale = useLocale();
		const tp = useTranslations('App.products');

		const dateTime = useCallback(
			(formatString: string) =>
				date &&
				formatDateTime({
					dateString: date,
					i18nLocale,
					formatString
				}),
			[date, i18nLocale]
		);

		return (
			<tr className={styles[BLOCK]}>
				<td className={styles[`${BLOCK}__content`]}>
					{title !== undefined && (
						<div className={styles[`${BLOCK}__name`]} title={title}>
							{title}
						</div>
					)}

					<div className={styles[`${BLOCK}__detail`]}>
						{products !== undefined && (
							<div className={styles[`${BLOCK}__detail-item`]}>
								<div className={styles[`${BLOCK}__container-icon`]}>
									<ListUl className={styles[`${BLOCK}__icon`]} size={15} />
								</div>
								<div>
									<div className={styles[`${BLOCK}__count`]}>
										{products.length}
									</div>
									<div className={styles[`${BLOCK}__secondary-text`]}>
										{tp('Products')}
									</div>
								</div>
							</div>
						)}

						{date !== undefined && (
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
						)}

						{price !== undefined && <OrderPrice price={price} />}
						{isDeleteButton && (
							<div className='d-flex align-items-center justify-content-center w-100 h-100'>
								<DeleteEntityButton id={id} />
							</div>
						)}
					</div>
				</td>
			</tr>
		);
	}
);
