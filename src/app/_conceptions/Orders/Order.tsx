'use client';

import type { OrderLocation } from '@prisma/client';
import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback, useMemo } from 'react';
import { CaretRight, GeoAltFill, ListUl, Pencil } from 'react-bootstrap-icons';

import { NavigationLink } from '@/components/NavigationLink';
import { Price } from '@/components/Price';

import { TLocationFormValue } from '@/types/location';

import { formatDateTime } from '@/utils/dateTime';
import { formatLocationLabel } from '@/utils/locationMap';
import { getOrderDetailHref, getOrderUpdateHref } from '@/utils/routing';

import styles from './Orders.module.scss';
import { type TOrderProps } from './types';
import { DeleteEntity } from '@/conceptions/DeleteOrder';
import {
	useAdaptiveTableSelector,
	useEntityIdSelector
} from '@/context/orders/useContext';

const BLOCK = 'order-item';

function UpdateIcon() {
	return <Pencil className={styles[`${BLOCK}__icon`]} size={15} />;
}

function ListUlIcon() {
	return <ListUl className={styles[`${BLOCK}__icon`]} size={15} />;
}

const toLocationDetails = (
	location?: OrderLocation | null
): TLocationFormValue | undefined => {
	if (!location) {
		return undefined;
	}

	const { latitude, longitude } = location;

	if (latitude === null || longitude === null) {
		return undefined;
	}

	return {
		lat: latitude,
		lng: longitude,
		country: location.country ?? undefined,
		state: location.state ?? undefined,
		city: location.city ?? undefined,
		district: location.district ?? undefined,
		street: location.street ?? undefined,
		postcode: location.postcode ?? undefined,
		displayName: location.displayName ?? undefined
	};
};

export const OrderRow = memo(
	({
		title,
		date,
		prices,
		amountOfProducts = 0,
		id,
		location,
		isUpdateButton = true,
		isDeleteButton = true
	}: TOrderProps) => {
		const entityId = useEntityIdSelector();
		const hasAdaptiveTable = useAdaptiveTableSelector();
		const i18nLocale = useLocale();
		const tp = useTranslations('App');

		const locationDetails = useMemo(
			() => toLocationDetails(location),
			[location]
		);

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
				<td
					className={clsx('d-flex align-items-center justify-content-center', {
						'px-4': !hasAdaptiveTable
					})}
				>
					<NavigationLink
						className={clsx(
							styles[`${BLOCK}__link`],
							'd-flex align-items-center justify-content-center w-100 h-100 text-decoration-none'
						)}
						href={getOrderDetailHref(id)}
					>
						<div
							className={clsx(
								styles[`${BLOCK}__content`],
								'overflow-hidden w-100'
							)}
						>
							{title !== null && (
								<div className={styles[`${BLOCK}__name`]}>
									<span className={styles[`${BLOCK}__name-title`]}>
										{title}
									</span>
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
										<ListUlIcon />
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

								{locationDetails !== undefined && (
									<div
										className={styles[`${BLOCK}__location`]}
										title={formatLocationLabel(locationDetails)}
									>
										<div
											className={clsx(
												styles[`${BLOCK}__container-icon`],
												'd-flex align-items-center justify-content-center'
											)}
										>
											<GeoAltFill />
										</div>
									</div>
								)}

								{date !== undefined && (
									<div className={styles[`${BLOCK}__detail-item`]}>
										<div>
											<div className={styles[`${BLOCK}__primary-text`]}>
												{dateTime('dd/MM')}
											</div>
											<div className={styles[`${BLOCK}__secondary-text`]}>
												{dateTime('dd/MM/yyyy')}
											</div>
										</div>
									</div>
								)}
								<Price prices={prices} hasAdaptiveTable={hasAdaptiveTable} />
							</div>
						</div>
					</NavigationLink>

					{isUpdateButton && (
						<div className='d-flex align-items-center justify-content-center h-100'>
							<NavigationLink
								className='d-flex align-items-center justify-content-center px-3 h-100'
								component={UpdateIcon}
								href={getOrderUpdateHref(id)}
							/>
						</div>
					)}

					{isDeleteButton && <DeleteEntity id={id} />}

					{hasAdaptiveTable && entityId !== id && !isDeleteButton && (
						<div className='d-flex align-items-center justify-content-center px-3 h-100'></div>
					)}

					{hasAdaptiveTable && entityId === id && (
						<div
							className={clsx(
								styles[`${BLOCK}__arrow`],
								'd-flex align-items-center justify-content-center h-100 px-2'
							)}
						>
							<CaretRight size={18} />
						</div>
					)}
				</td>
			</tr>
		);
	}
);
