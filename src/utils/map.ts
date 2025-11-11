import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

export const formatLocationLabel = (location: TLocationFormValue): string => {
	if (location.displayName) return location.displayName;

	const parts = [
		location.street,
		location.city,
		location.district,
		location.country
	]
		.filter(Boolean)
		.join(', ');

	if (parts) return parts;

	return `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
};

export const toLocationFormValue = (
	location: TPickupLocation
): TLocationFormValue => ({
	lat: location.latitude,
	lng: location.longitude,
	country: location.country ?? undefined,
	state: location.state ?? undefined,
	city: location.city ?? undefined,
	district: location.district ?? undefined,
	street: location.street ?? undefined,
	postcode: location.postcode ?? undefined,
	displayName: location.displayName ?? undefined
});

export const isSameLocation = (
	left?: TLocationFormValue,
	right?: TLocationFormValue
): boolean => {
	if (!left || !right) return false;
	const isLatEqual = Math.abs(left.lat - right.lat) < 1e-6;
	const isLngEqual = Math.abs(left.lng - right.lng) < 1e-6;
	return isLatEqual && isLngEqual;
};
