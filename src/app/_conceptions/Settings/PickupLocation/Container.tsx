'use client';

import { useTranslations } from 'next-intl';
import { Card } from 'react-bootstrap';

import { usePickupLocation } from '@/hooks/settings/pickupLocation';

import { PickupLocationList } from './List';
import { PickupLocationPopup } from './Popup';

export const PickupLocationContainer = () => {
	const t = useTranslations('App');
	const {
		items,
		pendingLocation,
		isSubmitting,
		errorCode,
		handleSuccessfulLocation,
		handleSelectLocation,
		handleOpen,
		handleApply,
		clearError
	} = usePickupLocation();

	return (
		<Card>
			<Card.Header as='h5' className='text-center'>
				{t('Pickup locations')}
			</Card.Header>
			<Card.Body className='d-flex flex-column align-items-center'>
				<PickupLocationList items={items} />
				<PickupLocationPopup
					items={items}
					pendingLocation={pendingLocation}
					onSuccessfulLocation={handleSuccessfulLocation}
					onSelectLocation={handleSelectLocation}
					onOpen={handleOpen}
					onApply={handleApply}
					clearError={clearError}
					isSubmitting={isSubmitting}
					errorCode={errorCode}
				/>
			</Card.Body>
		</Card>
	);
};
