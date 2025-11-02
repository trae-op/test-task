'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { Pencil } from 'react-bootstrap-icons';

import { NavigationLink } from '@/components/NavigationLink/NavigationLink';
import { Picture } from '@/components/Picture';
import { Price } from '@/components/Price';

import { formatDateTime } from '@/utils/dateTime';
import { getProductUpdateHref } from '@/utils/routing/routing';

import styles from './Products.module.scss';
import { ProductState } from './State';
import type { TProductProps } from './types';
import { DeleteEntity as DeleteProducts } from '@/conceptions/DeleteProducts';
import { useAdaptiveTableSelector } from '@/context/products/useContext';

const BLOCK = 'product-item';

function UpdateIcon() {
	return <Pencil className={styles[`${BLOCK}__icon`]} size={15} />;
}

export const ProductRow = memo(
	({
		title,
		serialNumber,
		isNew,
		guaranteeStart,
		guaranteeEnd,
		id,
		prices,
		photo,
		order,
		type,
		isDeleteButton = true
	}: TProductProps) => {
		const hasAdaptiveTable = useAdaptiveTableSelector();
		const i18nLocale = useLocale();
		const t = useTranslations('App');

		const dateTime = useCallback(
			(date: Date, formatString: string) =>
				formatDateTime({
					dateString: date,
					formatString,
					i18nLocale
				}),
			[i18nLocale]
		);
		return (
			<tr className={styles[BLOCK]}>
				<td
					className={clsx(
						{
							[styles[`${BLOCK}__content`]]: !hasAdaptiveTable,
							[styles[`${BLOCK}__detail`]]: hasAdaptiveTable
						},
						'px-4'
					)}
				>
					<div>
						<div
							className={clsx(
								styles[`${BLOCK}__status-dot`],
								styles[`${BLOCK}__status-dot-${isNew ? 'new' : 'used'}`]
							)}
						></div>
					</div>

					<div
						className={clsx(styles[`${BLOCK}__name`], 'd-flex gap-3 w-100')}
						title={title}
					>
						{typeof photo === 'string' && (
							<Picture src={photo} alt={title || ''} size='sm' loading='lazy' />
						)}
						<div className='d-flex flex-column align-items-start'>
							<span>{title}</span>
							<span>{serialNumber}</span>
						</div>
					</div>

					<ProductState isNew={isNew} />

					{type !== undefined && type !== null && (
						<div className='w-75 text-center'>
							<span>{type}</span>
						</div>
					)}

					{!hasAdaptiveTable && (type === undefined || type === null) && (
						<div className='w-75 text-center'>
							<span className='fs-1'>-</span>
						</div>
					)}

					{Boolean(guaranteeStart || guaranteeEnd) && (
						<div className={clsx(styles[`${BLOCK}__guarantee`], 'w-75')}>
							{guaranteeStart && (
								<span>
									<span>{t('from')}</span>{' '}
									{dateTime(guaranteeStart, 'dd/MM/yyyy')}
								</span>
							)}

							{guaranteeEnd && (
								<span>
									<span>{t('to')}</span> {dateTime(guaranteeEnd, 'dd/MM/yyyy')}
								</span>
							)}
						</div>
					)}

					{!hasAdaptiveTable &&
						(guaranteeStart === undefined || guaranteeStart === null) && (
							<div className={clsx(styles[`${BLOCK}__guarantee`], 'w-75')}>
								<span className='fs-1'>-</span>
							</div>
						)}

					<Price hasAdaptiveTable={hasAdaptiveTable} prices={prices} />

					{order !== undefined && order !== null && (
						<div className={clsx(styles[`${BLOCK}__order`])}>{order.title}</div>
					)}

					{!hasAdaptiveTable && (order === undefined || order === null) && (
						<div className={clsx(styles[`${BLOCK}__order`])}>
							<span className='fs-1'>-</span>
						</div>
					)}

					<div className='d-flex align-items-center justify-content-center h-100'>
						<NavigationLink
							className='d-flex align-items-center justify-content-center px-3 h-100'
							component={UpdateIcon}
							href={getProductUpdateHref(id)}
						/>
					</div>

					{isDeleteButton && <DeleteProducts id={id} />}
				</td>
			</tr>
		);
	}
);
