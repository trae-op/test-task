import { useMemo, useState } from 'react';

import type { TLocationDetails } from '@/types/location';

import type {
	TLocationMapState,
	TLocationMapStateHandlers,
	TLocationMapStateReturn
} from './types';

export const DEFAULT_MAP_CENTER = { lat: 48.3794, lng: 31.1656 } as const;
export const DEFAULT_MAP_ZOOM = 5;
export const FOCUSED_MAP_ZOOM = 13;

export const useLocationMapState = (
	initialLocation?: TLocationDetails
): TLocationMapStateReturn => {
	const [searchQuery, setSearchQueryState] = useState<string>('');
	const [isSearching, setIsSearchingState] = useState<boolean>(false);
	const [mapCenter, setMapCenterState] = useState<
		TLocationMapState['mapCenter']
	>(initialLocation ?? DEFAULT_MAP_CENTER);
	const [mapZoom, setMapZoomState] = useState<number>(
		initialLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM
	);
	const [markerPosition, setMarkerPositionState] = useState<
		TLocationDetails | undefined
	>(initialLocation);
	const [error, setErrorState] = useState<string | undefined>(undefined);

	const state: TLocationMapState = useMemo(
		() => ({
			searchQuery,
			isSearching,
			mapCenter,
			mapZoom,
			markerPosition,
			error
		}),
		[searchQuery, isSearching, mapCenter, mapZoom, markerPosition, error]
	);

	const handlers: TLocationMapStateHandlers = useMemo(
		() => ({
			setSearchQuery: setSearchQueryState,
			setIsSearching: setIsSearchingState,
			setMapCenter: setMapCenterState,
			setMapZoom: setMapZoomState,
			setMarkerPosition: setMarkerPositionState,
			setError: setErrorState
		}),
		[]
	);

	return useMemo(() => ({ state, handlers }), [state, handlers]);
};
