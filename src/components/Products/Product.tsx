import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { memo, useCallback } from 'react';

import { DeleteEntityButton } from '@/components/DeleteEntityButton';

import { formatDateTime } from '@/utils/dateTime';

import { ProductPrice } from './Price';
import styles from './Products.module.scss';
import { ProductState } from './State';
import type { TProductProps } from './types';

const BLOCK = 'product-item';

export const ProductRow = memo(
	({ title, serialNumber, isNew, guarantee, price, id }: TProductProps) => {
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

					<div className={styles[`${BLOCK}__name`]} title={title}>
						<span>{title}</span>
						<span>{serialNumber}</span>
					</div>

					<ProductState isNew={isNew} />

					<div className={styles[`${BLOCK}__guarantee`]}>
						<span>
							<span>{t('from')}</span>{' '}
							{dateTime(guarantee.start, 'dd / MM / yyyy')}
						</span>
						<span>
							<span>{t('to')}</span> {dateTime(guarantee.end, 'dd / MM / yyyy')}
						</span>
					</div>

					<div className={styles[`${BLOCK}__status`]}>
						{isNew === 1 ? tp('new') : tp('used')}
					</div>

					<ProductPrice price={price} />

					<div
						className={styles[`${BLOCK}__order`]}
						title='Длинное предлинное длиннющее название прихода'
					>
						Длинное предлинное длиннющее название прихода
					</div>

					<div className={styles[`${BLOCK}__delete-btn`]}>
						<DeleteEntityButton id={id} />
					</div>
				</td>
			</tr>
		);
	}
);
