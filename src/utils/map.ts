import type { TLocationFormValue } from '@/types/location';
import type { TPickupLocation } from '@/types/pickupLocation';

import { UKRAINE_POLYGON, WORLD_BOUNDS_POLYGON } from '@/constants';

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

export const UKRAINE_MASK_POLYGON: [number, number][][] = [
	WORLD_BOUNDS_POLYGON,
	[...UKRAINE_POLYGON].reverse()
];

export const isPointInPolygon = (
	point: { lat: number; lng: number },
	polygon: [number, number][]
): boolean => {
	const x = point.lat;
	const y = point.lng;
	let inside = false;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i][0];
		const yi = polygon[i][1];
		const xj = polygon[j][0];
		const yj = polygon[j][1];

		const intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
};

export const isPointInUkraine = (point: {
	lat: number;
	lng: number;
}): boolean => {
	return isPointInPolygon(point, UKRAINE_POLYGON);
};
