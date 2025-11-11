'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { ListGroup } from 'react-bootstrap';

import type { TPickupLocationListProps } from './types';

export const PickupLocationList = memo(
	({ items }: TPickupLocationListProps) => {
		const t = useTranslations('App');

		if (!items.length) {
			return (
				<p className='mb-3 text-muted'>
					{t('No pickup locations yet', {
						default: 'No pickup locations yet'
					})}
				</p>
			);
		}

		return (
			<ListGroup className='mb-3'>
				{items.map(item => (
					<ListGroup.Item key={item.id}>{item.label}</ListGroup.Item>
				))}
			</ListGroup>
		);
	}
);
