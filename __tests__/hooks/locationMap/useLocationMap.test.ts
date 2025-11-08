import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';

import { useLocationMap } from '@/hooks/locationMap';

import type { TLocationDetails } from '@/types/location';

jest.mock('@/services/openStreetMap', () => ({
	searchLocation: jest.fn(),
	reverseGeocode: jest.fn()
}));

const mockSearchLocation = jest.requireMock('@/services/openStreetMap')
	.searchLocation as jest.Mock;
const mockReverseGeocode = jest.requireMock('@/services/openStreetMap')
	.reverseGeocode as jest.Mock;

describe('useLocationMap', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const createChangeEvent = (value: string) =>
		({ target: { value } }) as ChangeEvent<HTMLInputElement>;

	it('should handle search and update marker position', async () => {
		const location: TLocationDetails = {
			lat: 50.45,
			lng: 30.52,
			country: 'Ukraine',
			city: 'Kyiv'
		};
		mockSearchLocation.mockResolvedValue(location);
		const onSuccess = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation: onSuccess })
		);

		act(() => {
			result.current.handleSearchInput(createChangeEvent('Kyiv'));
		});

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(mockSearchLocation).toHaveBeenCalledWith({ query: 'Kyiv' });
		expect(onSuccess).toHaveBeenCalledWith(location);
		expect(result.current.markerPosition).toEqual({
			lat: location.lat,
			lng: location.lng
		});
	});

	it('should expose error when search is empty', async () => {
		const { result } = renderHook(() => useLocationMap());

		await act(async () => {
			await result.current.handleSearchSubmit();
		});

		expect(result.current.error).toBe('Please enter a location');
	});

	it('should handle map click and reverse geocode', async () => {
		const reverseLocation: TLocationDetails = {
			lat: 49.83,
			lng: 24.03,
			country: 'Ukraine',
			city: 'Lviv'
		};
		mockReverseGeocode.mockResolvedValue(reverseLocation);
		const onSuccess = jest.fn();

		const { result } = renderHook(() =>
			useLocationMap({ onSuccessfulLocation: onSuccess })
		);

		await act(async () => {
			await result.current.handleMapClick({
				coords: { lat: 49.83, lng: 24.03 },
				zoom: 11
			});
		});

		expect(mockReverseGeocode).toHaveBeenCalledWith({ lat: 49.83, lng: 24.03 });
		expect(onSuccess).toHaveBeenCalledWith(reverseLocation);
		expect(result.current.markerPosition).toEqual({ lat: 49.83, lng: 24.03 });
		expect(result.current.mapZoom).toBe(11);
	});
});
