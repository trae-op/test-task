'use client';

import { useTranslations } from 'next-intl';
import { memo, useMemo } from 'react';
import { Alert } from 'react-bootstrap';

import { Button } from '@/components/Button';
import type { ButtonProps } from '@/components/Button/types';
import { LocationMap } from '@/components/LocationMap';
import { Popup } from '@/components/Popup/Popup';

import type { TPickupLocationPopupProps } from './types';
import { UKRAINE_POLYGON, WORLD_BOUNDS_POLYGON } from '@/constants';

const UKRAINE_MASK_POLYGON: [number, number][][] = [
	WORLD_BOUNDS_POLYGON,
	[...UKRAINE_POLYGON].reverse()
];

const ERROR_MESSAGE_KEYS = {
	UNAUTHORIZED: 'Unauthorized',
	INVALID_INPUT: 'Invalid location data',
	SERVER_ERROR: 'Failed to save pickup location',
	LOCATION_NOT_SELECTED: 'Please select a location'
} as const;

type TErrorMessageKey = keyof typeof ERROR_MESSAGE_KEYS;

const TriggerButton = ({ children, ...props }: ButtonProps) => {
	const t = useTranslations('App');

	return (
		<Button
			{...props}
			variant='success'
			text={t('Add pickup location', {
				default: 'Add pickup location'
			})}
		>
			{children}
		</Button>
	);
};

export const PickupLocationPopup = memo(
	({
		onSuccessfulLocation,
		onOpen,
		onApply,
		clearError,
		pendingLocation,
		isSubmitting,
		errorCode
	}: TPickupLocationPopupProps) => {
		const t = useTranslations('App');

		const errorMessage = useMemo(() => {
			if (!errorCode) return undefined;
			const translationKey = ERROR_MESSAGE_KEYS[errorCode as TErrorMessageKey];
			return t(translationKey);
		}, [errorCode, t]);

		return (
			<Popup
				title='Add pickup location'
				onApply={onApply}
				onOpen={onOpen}
				componentButton={TriggerButton}
				isLoading={isSubmitting}
				onHide={clearError}
			>
				<LocationMap
					onSuccessfulLocation={onSuccessfulLocation}
					initialLocation={pendingLocation}
					polygon={{
						availableBounds: UKRAINE_POLYGON,
						disabledBounds: UKRAINE_MASK_POLYGON
					}}
				/>
				{errorMessage ? (
					<Alert
						variant='danger'
						className='my-3'
						data-testid='settings-pickup-error'
					>
						{errorMessage}
					</Alert>
				) : null}
			</Popup>
		);
	}
);
