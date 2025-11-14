import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

export type TPickupLocationErrorCode =
	| 'UNAUTHORIZED'
	| 'INVALID_INPUT'
	| 'SERVER_ERROR'
	| 'LOCATION_NOT_SELECTED';

export type TPickupLocationItem = {
	id: string;
	location: TLocationFormValue;
	label: string;
	entity: TPickupLocation;
};

export type TPickupLocationState = {
	pendingLocation?: TLocationFormValue;
	isSubmitting: boolean;
	errorCode?: TPickupLocationErrorCode;
};

export type TPickupLocationStateHandlers = {
	setPendingLocation: (location: TLocationFormValue | undefined) => void;
	setIsSubmitting: (value: boolean) => void;
	setErrorCode: (code: TPickupLocationErrorCode | undefined) => void;
};

export type TPickupLocationStateReturn = {
	state: TPickupLocationState;
	handlers: TPickupLocationStateHandlers;
};

export type TPickupLocationActions = {
	handleSuccessfulLocation: (location: TLocationFormValue) => void;
	handleSelectLocation: (location: TLocationFormValue) => void;
	handleOpen: () => void;
	handleApply: (onClose: () => void) => Promise<void>;
	clearError: () => void;
};

export type TPickupLocationReturn = TPickupLocationState &
	TPickupLocationActions & {
		items: TPickupLocationItem[];
	};
