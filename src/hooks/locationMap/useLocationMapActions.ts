import { useCallback } from 'react';

import type { TLatLng, TLocationDetails } from '@/types/location';

import { reverseGeocode, searchLocation } from '@/services/openStreetMap';

import type {
	TLocationMapActions,
	TLocationMapState,
	TLocationMapStateHandlers,
	TUseLocationMapParams
} from './types';
import { FOCUSED_MAP_ZOOM } from './useLocationMapState';

type TUseLocationMapActionsParams = {
	state: TLocationMapState;
	handlers: TLocationMapStateHandlers;
} & TUseLocationMapParams;

export const useLocationMapActions = ({
	state,
	handlers,
	onSuccessfulLocation
}: TUseLocationMapActionsParams): TLocationMapActions => {
	const { searchQuery } = state;
	const {
		setSearchQuery,
		setIsSearching,
		setMapCenter,
		setMapZoom,
		setMarkerPosition,
		setError
	} = handlers;
	const handleSearchInput = useCallback<
		TLocationMapActions['handleSearchInput']
	>(
		event => {
			setSearchQuery(event.target.value);
			setError(undefined);
		},
		[setError, setSearchQuery]
	);

	const emitLocation = useCallback(
		(location: TLocationDetails) => {
			onSuccessfulLocation?.(location);
		},
		[onSuccessfulLocation]
	);

	const focusOnLocation = useCallback(
		(coords: TLatLng, zoom?: number) => {
			setMarkerPosition(coords);
			setMapCenter(coords);
			setMapZoom(zoom ?? FOCUSED_MAP_ZOOM);
		},
		[setMapCenter, setMapZoom, setMarkerPosition]
	);

	const handleSearchSubmit = useCallback<
		TLocationMapActions['handleSearchSubmit']
	>(async () => {
		const trimmedQuery = searchQuery.trim();
		if (!trimmedQuery) {
			setError('Please enter a location');
			return;
		}

		setIsSearching(true);
		setError(undefined);

		try {
			const location = await searchLocation({ query: trimmedQuery });
			if (!location) {
				setError('Location was not found');
				return;
			}

			focusOnLocation({ lat: location.lat, lng: location.lng });
			emitLocation(location);
		} catch (_error) {
			setError('Failed to fetch location data');
		} finally {
			setIsSearching(false);
		}
	}, [emitLocation, focusOnLocation, searchQuery, setError, setIsSearching]);

	const handleMapClick = useCallback<TLocationMapActions['handleMapClick']>(
		async ({ coords, zoom }) => {
			focusOnLocation(coords, zoom);

			try {
				const location = await reverseGeocode(coords);
				const details: TLocationDetails = location ?? {
					lat: coords.lat,
					lng: coords.lng
				};

				if (!location) {
					setError('No detailed address found for this point');
				} else {
					setError(undefined);
				}

				emitLocation(details);
			} catch (_error) {
				setError('Failed to resolve address for this point');
			}
		},
		[emitLocation, focusOnLocation, setError]
	);

	return {
		handleSearchInput,
		handleSearchSubmit,
		handleMapClick
	};
};
