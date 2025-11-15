import { act, renderHook } from '@testing-library/react';

import { useLocationMap } from '@/hooks/locationMap';

import type { TLocationDetails } from '@/types/location';

import { reverseGeocode, searchLocation } from '@/services/openStreetMap';

jest.mock('@/services/openStreetMap', () => ({
	searchLocation: jest.fn(),
	reverseGeocode: jest.fn()
}));

const mockedSearchLocation = searchLocation as jest.MockedFunction<
	typeof searchLocation
>;
const mockedReverseGeocode = reverseGeocode as jest.MockedFunction<
	typeof reverseGeocode
>;

const createLocation = (
	overrides?: Partial<TLocationDetails>
): TLocationDetails => ({
	lat: 10,
	lng: 20,
	displayName: 'Test location',
	address: {
		city: 'City',
		country: 'Country'
	},
	...overrides
});

describe('useLocationMap', () => {
	test('initializes with default values when no initialLocation is provided', () => {
		const { result } = renderHook(() => useLocationMap());

		expect(result.current.searchQuery).toBe('');
		expect(result.current.isSearching).toBe(false);
		expect(result.current.mapCenter).toEqual({ lat: 48.3794, lng: 31.1656 });
		expect(result.current.mapZoom).toBe(5);
		expect(result.current.markerPosition).toBeUndefined();
		expect(result.current.error).toBeUndefined();
	});

	test('initializes with provided initialLocation and focused zoom', () => {
		const initialLocation = createLocation();

		const { result } = renderHook(() => useLocationMap({ initialLocation }));

		expect(result.current.mapCenter).toEqual(initialLocation);
		expect(result.current.markerPosition).toEqual(initialLocation);
		expect(result.current.mapZoom).toBe(13);
	});

	test('handleSearchInput updates searchQuery and clears error', () => {
		const { result } = renderHook(() => useLocationMap());

		act(() => {
			result.current.handleSearchInput({
				target: { value: 'Kyiv' }
			} as React.ChangeEvent<HTMLInputElement>);
		});

		expect(result.current.searchQuery).toBe('Kyiv');
		expect(result.current.error).toBeUndefined();
	});

	test('handleSearchSubmit sets error when query is empty', async () => {
		const { result } = renderHook(() => useLocationMap());

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(result.current.error).toBe('Please enter a location');
		expect(result.current.isSearching).toBe(false);
	});

	test('handleSearchSubmit sets error when location not found', async () => {
		mockedSearchLocation.mockResolvedValueOnce(undefined);
		const { result } = renderHook(() => useLocationMap());

		act(() => {
			result.current.handleSearchInput({
				target: { value: 'Unknown' }
			} as React.ChangeEvent<HTMLInputElement>);
		});

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(mockedSearchLocation).toHaveBeenCalledWith({ query: 'Unknown' });
		expect(result.current.error).toBe('Location was not found');
		expect(result.current.isSearching).toBe(false);
	});

	test('handleSearchSubmit focuses and emits location on success', async () => {
		const location = createLocation({ lat: 50, lng: 30 });
		mockedSearchLocation.mockResolvedValueOnce(location);
		const onSuccessfulLocation = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation })
		);

		act(() => {
			result.current.handleSearchInput({
				target: { value: 'Kyiv' }
			} as React.ChangeEvent<HTMLInputElement>);
		});

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(mockedSearchLocation).toHaveBeenCalledWith({ query: 'Kyiv' });
		expect(result.current.mapCenter).toEqual({ lat: 50, lng: 30 });
		expect(result.current.markerPosition).toEqual({ lat: 50, lng: 30 });
		expect(result.current.mapZoom).toBe(13);
		expect(onSuccessfulLocation).toHaveBeenCalledWith(location);
		expect(result.current.error).toBeUndefined();
	});

	test('handleSearchSubmit sets error when search fails', async () => {
		mockedSearchLocation.mockRejectedValueOnce(new Error('Network error'));
		const { result } = renderHook(() => useLocationMap());

		act(() => {
			result.current.handleSearchInput({
				target: { value: 'Kyiv' }
			} as React.ChangeEvent<HTMLInputElement>);
		});

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(result.current.error).toBe('Failed to fetch location data');
		expect(result.current.isSearching).toBe(false);
	});

	test('handleMapClick focuses map and emits resolved location', async () => {
		const coords = { lat: 51, lng: 31 };
		const location = createLocation(coords);
		mockedReverseGeocode.mockResolvedValueOnce(location);
		const onSuccessfulLocation = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation })
		);

		await act(async () => {
			await result.current.handleMapClick({ coords, zoom: 10 });
		});

		expect(mockedReverseGeocode).toHaveBeenCalledWith(coords);
		expect(result.current.mapCenter).toEqual(coords);
		expect(result.current.markerPosition).toEqual(coords);
		expect(result.current.mapZoom).toBe(10);
		expect(onSuccessfulLocation).toHaveBeenCalledWith(location);
		expect(result.current.error).toBeUndefined();
	});

	test('handleMapClick emits coords and sets error when no location details', async () => {
		const coords = { lat: 51, lng: 31 };
		mockedReverseGeocode.mockResolvedValueOnce(undefined);
		const onSuccessfulLocation = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation })
		);

		await act(async () => {
			await result.current.handleMapClick({ coords, zoom: 12 });
		});

		expect(mockedReverseGeocode).toHaveBeenCalledWith(coords);
		expect(result.current.mapCenter).toEqual(coords);
		expect(result.current.markerPosition).toEqual(coords);
		expect(result.current.mapZoom).toBe(12);
		expect(onSuccessfulLocation).toHaveBeenCalledWith({
			lat: coords.lat,
			lng: coords.lng
		});
		expect(result.current.error).toBe(
			'No detailed address found for this point'
		);
	});

	test('handleMapClick sets error when reverse geocode fails', async () => {
		const coords = { lat: 51, lng: 31 };
		mockedReverseGeocode.mockRejectedValueOnce(new Error('Network error'));
		const onSuccessfulLocation = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation })
		);

		await act(async () => {
			await result.current.handleMapClick({ coords, zoom: 9 });
		});

		expect(result.current.error).toBe(
			'Failed to resolve address for this point'
		);
		expect(result.current.mapCenter).toEqual(coords);
		expect(result.current.markerPosition).toEqual(coords);
		expect(result.current.mapZoom).toBe(9);
		expect(onSuccessfulLocation).not.toHaveBeenCalled();
	});
});
