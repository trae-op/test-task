'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import Table from 'react-bootstrap/Table';

import { EmptyData } from '@/components/EmptyData/EmptyData';
import { Picture } from '@/components/Picture';

import type { TProduct } from '@/types/products';

import styles from '../styles/ProductsByOrder.module.scss';

const BLOCK = 'product-by-order';

export const ProductsByOrder = memo(({ items }: { items: TProduct[] }) => {
	const t = useTranslations('App');

	if (items.length === 0) {
		return <EmptyData text='Could not find any products' />;
	}

	return (
		<div className={clsx(styles['table-scroll-wrapper'], 'position-relative')}>
			<Table className={clsx(styles[BLOCK], 'mb-0')} borderless>
				<tbody>
					{items.map(({ isNew, title, photo, serialNumber, id }) => (
						<tr key={id} className={styles[BLOCK]}>
							<td className={clsx(styles[`${BLOCK}__detail`], 'px-4')}>
								<div>
									<div
										className={clsx(
											styles[`${BLOCK}__status-dot`],
											styles[`${BLOCK}__status-dot-${isNew ? 'new' : 'used'}`]
										)}
									></div>
								</div>

								<div
									className={clsx(
										styles[`${BLOCK}__name`],
										'd-flex gap-3 w-100'
									)}
									title={title}
								>
									<Picture
										src={photo || ''}
										alt={title || ''}
										size='sm'
										loading='lazy'
									/>
									<div className='d-flex flex-column align-items-start'>
										<span>{title}</span>
										<span>{serialNumber}</span>
									</div>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
});
