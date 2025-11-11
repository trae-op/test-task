import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

export type TAddPickupLocationInput = TLocationFormValue;

export type TAddPickupLocationResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'SERVER_ERROR';
	item?: TPickupLocation;
};

export type TGetPickupLocationsResult = {
	ok: boolean;
	code?: 'UNAUTHORIZED' | 'SERVER_ERROR';
	items?: TPickupLocation[];
};
