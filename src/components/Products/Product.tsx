'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { DeleteEntityButton } from '@/components/ui/DeleteEntityButton';
import { Picture } from '@/components/ui/Picture';

import { formatDateTime } from '@/utils/dateTime';

import { ProductPrice } from './Price';
import styles from './Products.module.scss';
import { ProductState } from './State';
import type { TProductProps } from './types';

const BLOCK = 'product-item';

export const ProductRow = memo(
	({
		title,
		serialNumber,
		isNew,
		guarantee,
		price,
		id,
		order,
		photo,
		isDetail = false
	}: TProductProps) => {
		const i18nLocale = useLocale();
		const tp = useTranslations('App.products.status');
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
				<td className={styles[`${BLOCK}__content`]}>
					<div>
						<div
							className={clsx(
								styles[`${BLOCK}__status-dot`],
								styles[`${BLOCK}__status-dot-${isNew === 1 ? 'new' : 'used'}`]
							)}
						></div>
					</div>

					<div
						className={clsx(styles[`${BLOCK}__name`], 'd-flex gap-3 w-100')}
						title={title}
					>
						{photo !== undefined && (
							<Picture src={photo} alt={title || ''} size='sm' loading='lazy' />
						)}
						<div className='d-flex flex-column align-items-start '>
							<span>{title}</span>
							<span>{serialNumber}</span>
						</div>
					</div>

					{isNew !== undefined && <ProductState isNew={isNew} />}

					{guarantee !== undefined && (
						<div className={clsx(styles[`${BLOCK}__guarantee`], 'w-75')}>
							<span>
								<span>{t('from')}</span>{' '}
								{dateTime(guarantee.start, 'dd / MM / yyyy')}
							</span>
							<span>
								<span>{t('to')}</span>{' '}
								{dateTime(guarantee.end, 'dd / MM / yyyy')}
							</span>
						</div>
					)}

					{price !== undefined && <ProductPrice price={price} />}

					{order !== undefined && (
						<div
							className={styles[`${BLOCK}__order`]}
							title='Длинное предлинное длиннющее название прихода'
						>
							Длинное предлинное длиннющее название прихода
						</div>
					)}

					<div className='d-flex align-items-center justify-content-center w-50 h-100'>
						<ConfirmPopup
							componentButton={DeleteEntityButton}
							iconButton={Trash}
							openButtonClassName={clsx('w-100 h-100')}
							title={'Delete this product?'}
							confirmText={'Delete'}
							cancelText={'Cancel'}
							onConfirm={() => {
								console.log('Delete product', id);
							}}
						/>
					</div>
				</td>
			</tr>
		);
	}
);
