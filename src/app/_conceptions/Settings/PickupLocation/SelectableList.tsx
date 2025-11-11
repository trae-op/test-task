'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';

import { Button } from '@/components/Button';

import { isSameLocation } from '@/utils/map';

import type { TPickupLocationSelectableListProps } from './types';

export const PickupLocationSelectableList = memo(
	({
		items,
		selectedLocation,
		onSelect
	}: TPickupLocationSelectableListProps) => {
		const t = useTranslations('App');

		if (!items.length) {
			return (
				<p className='mb-0 text-muted'>
					{t('No pickup locations yet', {
						default: 'No pickup locations yet'
					})}
				</p>
			);
		}

		return (
			<div className='d-flex flex-column gap-2'>
				{items.map(item => {
					const isSelected = isSameLocation(item.location, selectedLocation);

					return (
						<Button
							key={item.id}
							variant={isSelected ? 'primary' : 'outline-secondary'}
							text={item.label}
							className='w-100'
							onClick={() => onSelect(item.location)}
						/>
					);
				})}
			</div>
		);
	}
);
