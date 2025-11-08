import type { TLatLng, TLocationDetails } from '@/types/location';

export type TNominatimAddress = {
	country?: string;
	state?: string;
	county?: string;
	city?: string;
	town?: string;
	village?: string;
	municipality?: string;
	suburb?: string;
	city_district?: string;
	neighbourhood?: string;
	road?: string;
	pedestrian?: string;
	footway?: string;
	highway?: string;
	postcode?: string;
	display_name?: string;
};

export type TNominatimSearchResult = {
	lat: string;
	lon: string;
	display_name?: string;
	address?: TNominatimAddress;
};

export type TNominatimReverseResult = TNominatimSearchResult;

export type TSearchLocationParams = {
	query: string;
};

export type TReverseGeocodeParams = TLatLng;

export type TSearchLocationReturn = TLocationDetails | null;
export type TReverseGeocodeReturn = TLocationDetails | null;
