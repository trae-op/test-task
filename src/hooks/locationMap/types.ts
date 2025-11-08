import type { ChangeEvent } from 'react';

import type { TLatLng, TLocationDetails } from '@/types/location';

export type TLocationMapState = {
	searchQuery: string;
	isSearching: boolean;
	mapCenter: TLatLng;
	mapZoom: number;
	markerPosition?: TLatLng;
	error?: string;
};

export type TLocationMapStateHandlers = {
	setSearchQuery: (value: string) => void;
	setIsSearching: (value: boolean) => void;
	setMapCenter: (value: TLatLng) => void;
	setMapZoom: (value: number) => void;
	setMarkerPosition: (value?: TLatLng) => void;
	setError: (value?: string) => void;
};

export type TLocationMapClickParams = {
	coords: TLatLng;
	zoom: number;
};

export type TLocationMapActions = {
	handleSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
	handleSearchSubmit: () => Promise<void>;
	handleMapClick: (params: TLocationMapClickParams) => Promise<void>;
};

export type TLocationMapStateReturn = {
	state: TLocationMapState;
	handlers: TLocationMapStateHandlers;
};

export type TLocationMapHookReturn = TLocationMapState & TLocationMapActions;

export type TUseLocationMapParams = {
	onSuccessfulLocation?: (location: TLocationDetails) => void;
	initialLocation?: TLocationDetails;
};
