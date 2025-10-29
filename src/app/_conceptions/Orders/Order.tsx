'use client';

import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { CaretRight, ListUl } from 'react-bootstrap-icons';

import { NavigationLink } from '@/components/NavigationLink';
import { Price } from '@/components/Price';

import { formatDateTime } from '@/utils/dateTime';
import { getOrderDetailHref } from '@/utils/routing';

import styles from './Orders.module.scss';
import { type TOrderProps } from './types';
import { DeleteEntity } from '@/conceptions/DeleteOrder';
import { useEntityIdSelector } from '@/context/orders/useContext';

const BLOCK = 'order-item';

function ListUlIcon() {
	return <ListUl className={styles[`${BLOCK}__icon`]} size={15} />;
}

export const OrderRow = memo(
	({
		title,
		date,
		prices,
		amountOfProducts = 0,
		id,
		isDeleteButton = true
	}: TOrderProps) => {
		const entityId = useEntityIdSelector();
		const i18nLocale = useLocale();
		const tp = useTranslations('App');

		console.log('OrderRow', title);

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
						<div className={styles[`${BLOCK}__detail-item`]}>
							<div
								className={clsx(
									styles[`${BLOCK}__container-icon`],
									'd-flex align-items-center justify-content-center'
								)}
							>
								<NavigationLink
									title={title}
									className='d-flex align-items-center justify-content-center'
									href={getOrderDetailHref(id)}
									text={title}
									component={ListUlIcon}
								/>
							</div>
							<div
								className={clsx(
									styles[`${BLOCK}__container-count`],
									'd-flex flex-column'
								)}
							>
								<span className={styles[`${BLOCK}__count`]}>
									{amountOfProducts}
								</span>
								<span className={styles[`${BLOCK}__primary-text`]}>
									{tp('Products')}
								</span>
							</div>
						</div>

						{date !== undefined && (
							<div className={styles[`${BLOCK}__detail-item`]}>
								<div>
									<div className={styles[`${BLOCK}__primary-text`]}>
										{dateTime('dd / MM')}
									</div>
									<div className={styles[`${BLOCK}__secondary-text`]}>
										{dateTime('dd / MM / yyyy')}
									</div>
								</div>
							</div>
						)}

						<Price prices={prices} />
						{isDeleteButton && <DeleteEntity id={id} />}

						{!entityId && !isDeleteButton && (
							<div className='d-flex align-items-center justify-content-center px-3 h-100'></div>
						)}

						{entityId === id && (
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
