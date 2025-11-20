import type { TLocationDetails } from '@/types/location';

import type {
	TNominatimAddress,
	TNominatimReverseResult,
	TNominatimSearchResult,
	TReverseGeocodeParams,
	TReverseGeocodeReturn,
	TSearchLocationParams,
	TSearchLocationReturn
} from './types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const DEFAULT_HEADERS: HeadersInit = {
	'Accept-Language': 'en',
	'User-Agent': 'test-task/1.0 (https://github.com/trae-op)'
};

const normalizeDisplayName = (value?: string) => value?.trim() || undefined;

const extractStreet = (address?: TNominatimAddress) =>
	address?.road || address?.pedestrian || address?.footway || address?.highway;

const extractDistrict = (address?: TNominatimAddress) =>
	address?.city_district ||
	address?.suburb ||
	address?.neighbourhood ||
	undefined;

const extractCity = (address?: TNominatimAddress) =>
	address?.city || address?.town || address?.village || address?.municipality;

const mapToLocationDetails = ({
	lat,
	lon,
	display_name: rawDisplayName,
	address
}: TNominatimSearchResult): TLocationDetails => ({
	lat: Number(lat),
	lng: Number(lon),
	country: address?.country,
	state: address?.state,
	city: extractCity(address),
	district: extractDistrict(address),
	street: extractStreet(address),
	postcode: address?.postcode,
	displayName: normalizeDisplayName(rawDisplayName)
});

const buildUrl = (pathname: string, params: Record<string, string>) => {
	const url = new URL(`${NOMINATIM_BASE_URL}/${pathname}`);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			url.searchParams.append(key, value);
		}
	});
	return url.toString();
};

const request = async <T>(url: string): Promise<T> => {
	const response = await fetch(url, {
		headers: DEFAULT_HEADERS,
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error(
			`OpenStreetMap request failed with status ${response.status}`
		);
	}

	return (await response.json()) as T;
};

export const searchLocation = async ({
	query
}: TSearchLocationParams): Promise<TSearchLocationReturn> => {
	const trimmedQuery = query.trim();
	if (!trimmedQuery) {
		return null;
	}

	const url = buildUrl('search', {
		format: 'jsonv2',
		q: trimmedQuery,
		limit: '1',
		addressdetails: '1',
		countrycodes: 'ua'
	});

	const results = await request<TNominatimSearchResult[]>(url);

	if (!Array.isArray(results) || results.length === 0) {
		return null;
	}

	return mapToLocationDetails(results[0]);
};

export const reverseGeocode = async ({
	lat,
	lng
}: TReverseGeocodeParams): Promise<TReverseGeocodeReturn> => {
	const url = buildUrl('reverse', {
		format: 'jsonv2',
		lat: String(lat),
		lon: String(lng),
		addressdetails: '1'
	});

	const result = await request<TNominatimReverseResult>(url);

	if (!result) {
		return null;
	}

	return mapToLocationDetails(result);
};
