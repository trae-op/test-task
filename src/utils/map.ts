import { TLocationFormValue } from '@/types/location';

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
