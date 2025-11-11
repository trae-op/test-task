import type {
	TPickupLocationErrorCode,
	TPickupLocationItem
} from '@/hooks/settings/pickupLocation/types';

import type { TLocationFormValue } from '@/types/location';

export type TPickupLocationListProps = {
	items: TPickupLocationItem[];
};

export type TPickupLocationSelectableListProps = {
	items: TPickupLocationItem[];
	selectedLocation?: TLocationFormValue;
	onSelect: (location: TLocationFormValue) => void;
};

export type TPickupLocationPopupProps = {
	items: TPickupLocationItem[];
	pendingLocation?: TLocationFormValue;
	onSuccessfulLocation: (location: TLocationFormValue) => void;
	onSelectLocation: (location: TLocationFormValue) => void;
	onOpen: () => void;
	onApply: (onClose: () => void) => Promise<void>;
	clearError: () => void;
	isSubmitting: boolean;
	errorCode?: TPickupLocationErrorCode;
};
