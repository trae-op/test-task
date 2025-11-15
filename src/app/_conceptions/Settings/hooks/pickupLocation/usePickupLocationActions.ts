import { useCallback } from 'react';

import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

import { addPickupLocation } from '../../actions/pickupLocation';

import type {
	TPickupLocationActions,
	TPickupLocationState,
	TPickupLocationStateHandlers
} from './types';

const mergeItems = (
	items: TPickupLocation[],
	created: TPickupLocation
): TPickupLocation[] => {
	const isExisting = items.some(item => item.id === created.id);
	if (isExisting) {
		return items.map(item => (item.id === created.id ? created : item));
	}

	return [created, ...items];
};

type TUsePickupLocationActionsParams = {
	state: TPickupLocationState;
	handlers: TPickupLocationStateHandlers;
	rawItems: TPickupLocation[];
	setAll: (items: TPickupLocation[]) => void;
};

export const usePickupLocationActions = ({
	state,
	handlers,
	rawItems,
	setAll
}: TUsePickupLocationActionsParams): TPickupLocationActions => {
	const { pendingLocation } = state;
	const { setPendingLocation, setIsSubmitting, setErrorCode } = handlers;

	const clearError = useCallback(() => {
		setErrorCode(undefined);
	}, [setErrorCode]);

	const assignLocation = useCallback(
		(location: TLocationFormValue) => {
			setPendingLocation(location);
			setErrorCode(undefined);
		},
		[setPendingLocation, setErrorCode]
	);

	const handleSuccessfulLocation: TPickupLocationActions['handleSuccessfulLocation'] =
		useCallback(
			location => {
				assignLocation(location);
			},
			[assignLocation]
		);

	const handleSelectLocation: TPickupLocationActions['handleSelectLocation'] =
		useCallback(
			location => {
				assignLocation(location);
			},
			[assignLocation]
		);

	const handleOpen = useCallback(() => {
		setErrorCode(undefined);
		setPendingLocation(undefined);
	}, [setErrorCode, setPendingLocation]);

	const handleApply: TPickupLocationActions['handleApply'] = useCallback(
		async onClose => {
			if (!pendingLocation) {
				setErrorCode('LOCATION_NOT_SELECTED');
				return;
			}

			setIsSubmitting(true);
			setErrorCode(undefined);

			try {
				const result = await addPickupLocation(pendingLocation);
				if (!result.ok || !result.item) {
					setErrorCode(result.code ?? 'SERVER_ERROR');
					return;
				}

				setAll(mergeItems(rawItems, result.item));
				setPendingLocation(undefined);
				onClose();
			} catch (_error) {
				setErrorCode('SERVER_ERROR');
			} finally {
				setIsSubmitting(false);
			}
		},
		[
			rawItems,
			pendingLocation,
			setAll,
			setErrorCode,
			setIsSubmitting,
			setPendingLocation
		]
	);

	return {
		handleSuccessfulLocation,
		handleSelectLocation,
		handleOpen,
		handleApply,
		clearError
	};
};
