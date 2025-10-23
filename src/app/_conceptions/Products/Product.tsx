'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';
import { Picture } from '@/components/Picture';
import { Popup } from '@/components/Popup';
import { Price } from '@/components/Price';

import { formatDateTime } from '@/utils/dateTime';

import styles from './Products.module.scss';
import { ProductState } from './State';
import type { TProductProps } from './types';

const BLOCK = 'product-item';

export const ProductRow = memo(
	({
		title,
		serialNumber,
		isNew,
		guaranteeStart,
		guaranteeEnd,
		id,
		prices,
		orderTitle,
		photo,
		isDetail = false
	}: TProductProps) => {
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
					className={clsx({
						[styles[`${BLOCK}__content`]]: !isDetail,
						[styles[`${BLOCK}__detail`]]: isDetail
					})}
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
						{photo !== null && photo.length && (
							<Picture src={photo} alt={title || ''} size='sm' loading='lazy' />
						)}
						<div className='d-flex flex-column align-items-start '>
							<span>{title}</span>
							<span>{serialNumber}</span>
						</div>
					</div>

					{isNew !== undefined && <ProductState isNew={isNew} />}

					{Boolean(guaranteeStart || guaranteeEnd) && (
						<div className={clsx(styles[`${BLOCK}__guarantee`], 'w-75')}>
							{guaranteeStart && (
								<span>
									<span>{t('from')}</span>{' '}
									{dateTime(guaranteeStart, 'dd / MM / yyyy')}
								</span>
							)}

							{guaranteeEnd && (
								<span>
									<span>{t('to')}</span>{' '}
									{dateTime(guaranteeEnd, 'dd / MM / yyyy')}
								</span>
							)}
						</div>
					)}

					<Price prices={prices} />

					{orderTitle !== undefined && (
						<div className={styles[`${BLOCK}__order`]} title={orderTitle}>
							{orderTitle}
						</div>
					)}

					<div className='d-flex align-items-center justify-content-center w-50 h-100'>
						<Popup
							componentButton={DeleteEntityButton}
							applyIconButton={Trash}
							iconButton={Trash}
							openButtonClassName={clsx('w-100 h-100')}
							title={'Delete this order?'}
							applyText='Delete'
							applyButtonClassName=''
							onApply={onClose => {
								console.log('Delete order', id);
								onClose();
							}}
						/>
					</div>
				</td>
			</tr>
		);
	}
);
