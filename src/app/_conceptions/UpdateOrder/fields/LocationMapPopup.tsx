'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import type { ButtonProps } from '@/components/Button/types';
import { LocationMap } from '@/components/LocationMap';
import { Popup } from '@/components/Popup/Popup';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

import type { TLocationFormValue } from '@/types/location';

import { formatLocationLabel } from '@/utils/locationMap';

const TriggerButton = ({ children, ...props }: ButtonProps) => {
	const t = useTranslations('App');

	return (
		<Button variant='success' {...props} text={t('Select location')}>
			{children}
		</Button>
	);
};

export const LocationMapPopup = () => {
	const t = useTranslations('App');
	const { setValue, watch } = useFormContext<TUpdateOrderFormData>();
	const persistedLocation = watch('location');
	const [pendingLocation, setPendingLocation] = useState<
		TLocationFormValue | undefined
	>(undefined);

	const handleSuccessfulLocation = useCallback(
		(location: TLocationFormValue) => {
			setPendingLocation(location);
		},
		[]
	);

	const handleApply = useCallback(
		(onClose: () => void) => {
			if (pendingLocation) {
				setValue('location', pendingLocation, {
					shouldDirty: true,
					shouldTouch: true
				});
			}

			onClose();
		},
		[pendingLocation]
	);

	const handleOpen = useCallback(() => {
		setPendingLocation(persistedLocation ?? undefined);
	}, [persistedLocation]);

	const selectedLocation = pendingLocation ?? persistedLocation ?? undefined;

	return (
		<div className='mb-3'>
			<Popup
				title='Select location'
				componentButton={TriggerButton}
				onApply={handleApply}
				onOpen={handleOpen}
			>
				<LocationMap
					onSuccessfulLocation={handleSuccessfulLocation}
					initialLocation={selectedLocation}
				/>
			</Popup>
			{selectedLocation ? (
				<div className='mt-2'>
					<span className='d-block fw-semibold'>
						{t('Selected location', { default: 'Selected location' })}
					</span>
					<span>{formatLocationLabel(selectedLocation)}</span>
				</div>
			) : null}
		</div>
	);
};
