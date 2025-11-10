'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { GeoAltFill } from 'react-bootstrap-icons';

import type { ButtonProps } from '@/components/Button/types';
import { LocationMap } from '@/components/LocationMap';
import { Popup } from '@/components/Popup/Popup';

import type { TLocationFormValue } from '@/types/location';

import { formatLocationLabel } from '@/utils/map';

import styles from './OrderViewLocation.module.scss';
import type { TOrderViewLocationProps } from './types';

const TriggerButton = ({ ...props }: ButtonProps) => {
	const t = useTranslations('App');

	return (
		<div className='d-flex align-items-center justify-content-center'>
			<button
				{...props}
				type='button'
				className={clsx(
					styles['open-location-button'],
					'd-flex align-items-center justify-content-center'
				)}
				aria-label='Place location'
			>
				<GeoAltFill
					className={styles['open-location-button__icon']}
					size={20}
				/>
			</button>
			<span>{t('Place location')}</span>
		</div>
	);
};

const toLocationDetails = (
	location?: TOrderViewLocationProps['location']
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

export const OrderViewLocation = ({ location }: TOrderViewLocationProps) => {
	const t = useTranslations('App');

	const locationDetails = useMemo(
		() => toLocationDetails(location),
		[location]
	);

	if (locationDetails) {
		return (
			<Popup
				title='Order location'
				componentButton={TriggerButton}
				cancelText='Close'
				showApplyButton={false}
				openButtonAriaLabel={t('View location')}
			>
				<LocationMap
					initialLocation={locationDetails}
					showSearchControls={false}
					isInteractive={false}
				/>
				<div className='mt-2'>
					<span className='d-block fw-semibold'>{t('Selected location')}</span>
					<span>{formatLocationLabel(locationDetails)}</span>
				</div>
			</Popup>
		);
	}

	return <span className='text-muted'>{t('Location is not available')}</span>;
};
