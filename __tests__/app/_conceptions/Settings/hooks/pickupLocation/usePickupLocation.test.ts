import { renderHook } from '@testing-library/react';

import type { TPickupLocation } from '@/types/pickupLocation';

import { formatLocationLabel, toLocationFormValue } from '@/utils/map';

import {
	useListSelector,
	useSetAllDispatch
} from '@/app/_conceptions/Settings/context/pickupLocation/useContext';
import { usePickupLocation } from '@/app/_conceptions/Settings/hooks/pickupLocation';
import { usePickupLocationActions } from '@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationActions';
import { usePickupLocationState } from '@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationState';

jest.mock(
	'@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationState'
);
jest.mock(
	'@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationActions',
	() => ({
		usePickupLocationActions: jest.fn()
	})
);
jest.mock(
	'@/app/_conceptions/Settings/context/pickupLocation/useContext',
	() => ({
		useListSelector: jest.fn(),
		useSetAllDispatch: jest.fn()
	})
);
jest.mock('@/utils/map', () => ({
	formatLocationLabel: jest.fn(),
	toLocationFormValue: jest.fn()
}));

describe('usePickupLocation', () => {
	const stateMock = {
		state: {
			pendingLocation: undefined,
			isSubmitting: false,
			errorCode: undefined
		},
		handlers: {
			setPendingLocation: jest.fn(),
			setIsSubmitting: jest.fn(),
			setErrorCode: jest.fn()
		}
	};

	const actionsMock = {
		handleSuccessfulLocation: jest.fn(),
		handleSelectLocation: jest.fn(),
		handleOpen: jest.fn(),
		handleApply: jest.fn(),
		clearError: jest.fn()
	};

	const rawItems: TPickupLocation[] = [
		{ id: 'loc-1', latitude: 1, longitude: 2 } as TPickupLocation
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(usePickupLocationState as jest.Mock).mockReturnValue(stateMock);
		(usePickupLocationActions as jest.Mock).mockReturnValue(actionsMock);
		(useListSelector as jest.Mock).mockReturnValue(rawItems);
		(useSetAllDispatch as jest.Mock).mockReturnValue(jest.fn());
		(toLocationFormValue as jest.Mock).mockReturnValue({ lat: 1, lng: 2 });
		(formatLocationLabel as jest.Mock).mockReturnValue('Label 1');
	});

	describe('positive cases', () => {
		test('maps raw entities into items with formatted labels', () => {
			const { result } = renderHook(() => usePickupLocation());

			expect(result.current.items).toHaveLength(1);
			expect(result.current.items[0]).toEqual({
				id: 'loc-1',
				location: { lat: 1, lng: 2 },
				label: 'Label 1',
				entity: rawItems[0]
			});
			expect(result.current.handleApply).toBe(actionsMock.handleApply);
		});
	});

	describe('negative cases', () => {
		test('returns empty items when selector empty', () => {
			(useListSelector as jest.Mock).mockReturnValueOnce([]);
			const { result } = renderHook(() => usePickupLocation());
			expect(result.current.items).toHaveLength(0);
		});
	});

	describe('edge cases', () => {
		test('uses formatted location derived from converter', () => {
			renderHook(() => usePickupLocation());
			expect(toLocationFormValue).toHaveBeenCalledWith(rawItems[0]);
			expect(formatLocationLabel).toHaveBeenCalledWith({ lat: 1, lng: 2 });
		});
	});
});
