import { act, renderHook } from '@testing-library/react';

import { usePickupLocationState } from '@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationState';

describe('usePickupLocationState', () => {
	describe('positive cases', () => {
		test('returns default state snapshot', () => {
			const { result } = renderHook(() => usePickupLocationState());
			expect(result.current.state).toEqual({
				pendingLocation: undefined,
				isSubmitting: false,
				errorCode: undefined
			});
		});
	});

	describe('negative cases', () => {
		test('updates pending location and error', () => {
			const { result } = renderHook(() => usePickupLocationState());

			act(() => {
				result.current.handlers.setPendingLocation({ lat: 10, lng: 20 });
				result.current.handlers.setErrorCode('SERVER_ERROR');
			});

			expect(result.current.state.pendingLocation).toEqual({
				lat: 10,
				lng: 20
			});
			expect(result.current.state.errorCode).toBe('SERVER_ERROR');
		});
	});

	describe('edge cases', () => {
		test('toggles submitting flag', () => {
			const { result } = renderHook(() => usePickupLocationState());

			act(() => {
				result.current.handlers.setIsSubmitting(true);
			});

			expect(result.current.state.isSubmitting).toBe(true);
		});
	});
});
