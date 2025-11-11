'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import type { ButtonProps } from '@/components/Button/types';
import { LocationMap } from '@/components/LocationMap';
import { Popup } from '@/components/Popup/Popup';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

import type { TLocationFormValue } from '@/types/location';

import {
	formatLocationLabel,
	isSameLocation,
	toLocationFormValue
} from '@/utils/map';

import { useListSelector } from '@/context/pickupLocation/useContext';

const TriggerButton = ({ children, ...props }: ButtonProps) => {
	const t = useTranslations('App');
	const pickupLocations = useListSelector();

	return (
		<Button
			{...props}
			text={t('Select location')}
			disabled={!pickupLocations.length}
		>
			{children}
		</Button>
	);
};

export const LocationMapPopup = () => {
	const t = useTranslations('App');
	const { setValue, watch } = useFormContext<TUpdateOrderFormData>();
	const persistedLocation = watch('location');
	const pickupLocations = useListSelector();
	const [pendingLocation, setPendingLocation] = useState<
		TLocationFormValue | undefined
	>(undefined);

	const pickupLocationOptions = useMemo(
		() =>
			pickupLocations.map(location => {
				const details = toLocationFormValue(location);
				return {
					id: location.id,
					location: details,
					label: formatLocationLabel(details)
				};
			}),
		[pickupLocations]
	);

	const handleSuccessfulLocation = useCallback(
		(location: TLocationFormValue) => {
			setPendingLocation(location);
		},
		[]
	);

	const handleSelectPickupLocation = useCallback(
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
		[pendingLocation, setValue]
	);

	const handleOpen = useCallback(() => {
		setPendingLocation(persistedLocation ?? undefined);
	}, [persistedLocation]);

	const selectedLocation = pendingLocation ?? persistedLocation ?? undefined;

	const selectedId = useMemo(() => {
		if (!selectedLocation) return undefined;
		const match = pickupLocationOptions.find(option =>
			isSameLocation(option.location, selectedLocation)
		);
		return match?.id;
	}, [pickupLocationOptions, selectedLocation]);

	return (
		<div className='mb-3'>
			<Popup
				title='Select location'
				componentButton={TriggerButton}
				onApply={handleApply}
				onOpen={handleOpen}
			>
				<div className='d-flex flex-column flex-lg-row gap-3'>
					<div className='flex-fill w-100'>
						<LocationMap
							isInteractive={false}
							showSearchControls={false}
							onSuccessfulLocation={handleSuccessfulLocation}
							initialLocation={selectedLocation}
						/>
					</div>
					<div className='flex-fill w-75'>
						<h5
							className='mb-2 p-2 text-center fw-semibold'
							style={{ height: 53 }}
						>
							{t('Pickup locations')}
						</h5>
						{pickupLocationOptions.length ? (
							<div
								className='d-flex flex-column gap-2 overflow-auto'
								style={{ maxHeight: 320 }}
							>
								{pickupLocationOptions.map(option => {
									const onClick = () =>
										handleSelectPickupLocation(option.location);
									return (
										<Button
											key={option.id}
											variant={
												option.id === selectedId
													? 'success'
													: 'outline-secondary'
											}
											text={option.label}
											className='rounded-1 w-100 h-auto'
											onClick={onClick}
										/>
									);
								})}
							</div>
						) : (
							<p className='mb-0 text-muted'>
								{t('No pickup locations yet', {
									default: 'No pickup locations yet'
								})}
							</p>
						)}
					</div>
				</div>
			</Popup>
			{selectedLocation !== undefined && (
				<div className='pt-2'>{formatLocationLabel(selectedLocation)}</div>
			)}
		</div>
	);
};
