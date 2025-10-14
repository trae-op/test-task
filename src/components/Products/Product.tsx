import clsx from 'clsx';
import { memo, useCallback } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { formatDateTime } from '@/utils/dateTime';

import { ProductPrice } from './Price';
import styles from './Products.module.scss';
import { ProductState } from './State';
import type { TProductProps } from './types';

const BLOCK = 'product-item';

export const ProductRow = memo(
	({ title, serialNumber, isNew, guarantee, price }: TProductProps) => {
		const dateTime = useCallback(
			(date: Date, formatString: string) =>
				formatDateTime({
					dateString: date,
					formatString
				}),
			[]
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
							<span>from</span> {dateTime(guarantee.start, 'dd / MM / yyyy')}
						</span>
						<span>
							<span>to</span> {dateTime(guarantee.end, 'dd / MM / yyyy')}
						</span>
					</div>

					<div className={styles[`${BLOCK}__status`]}>
						{isNew === 1 ? 'new' : 'used'}
					</div>

					<ProductPrice price={price} />

					<div
						className={styles[`${BLOCK}__order`]}
						title='Длинное предлинное длиннющее название прихода'
					>
						Длинное предлинное длиннющее название прихода
					</div>

					<div className={styles[`${BLOCK}__delete-btn`]}>
						<Trash size={18} />
					</div>
				</td>
			</tr>
		);
	}
);
