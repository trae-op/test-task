import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { CaretRight, ListUl } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/ui/DeleteEntityButton';
import { NavigationLink } from '@/components/ui/NavigationLink';

import { formatDateTime } from '@/utils/dateTime';
import { getOrderDetailHref } from '@/utils/routing';

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
		isDeleteButton = true,
		isActive = false
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
				<td className={clsx(styles[`${BLOCK}__content`], 'overflow-hidden')}>
					{title !== undefined && (
						<div className={styles[`${BLOCK}__name`]}>
							<NavigationLink
								title={title}
								className={styles[`${BLOCK}__name-link`]}
								href={getOrderDetailHref(id)}
								text={title}
							/>
						</div>
					)}

					<div className={styles[`${BLOCK}__detail`]}>
						{products !== undefined && (
							<div className={styles[`${BLOCK}__detail-item`]}>
								<div className={styles[`${BLOCK}__container-icon`]}>
									<ListUl className={styles[`${BLOCK}__icon`]} size={15} />
								</div>
								<div
									className={clsx(
										styles[`${BLOCK}__container-count`],
										'd-flex flex-column'
									)}
								>
									<span className={styles[`${BLOCK}__count`]}>
										{products.length}
									</span>
									<span className={styles[`${BLOCK}__primary-text`]}>
										{tp('Products')}
									</span>
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

						{!isActive && !isDeleteButton && (
							<div className='d-flex align-items-center justify-content-center h-100 px-3'></div>
						)}

						{isActive && (
							<div
								className={clsx(
									styles[`${BLOCK}__arrow`],
									'd-flex align-items-center justify-content-center h-100 px-2'
								)}
							>
								<CaretRight size={18} />
							</div>
						)}
					</div>
				</td>
			</tr>
		);
	}
);
