import { act, renderHook } from '@testing-library/react';

import { usePickupLocationState } from '@/hooks/settings/pickupLocation/usePickupLocationState';

describe('hooks/settings/pickupLocation/usePickupLocationState', () => {
	it('returns initial state and handlers', () => {
		const { result } = renderHook(() => usePickupLocationState());

		expect(result.current.state).toEqual({
			pendingLocation: undefined,
			isSubmitting: false,
			errorCode: undefined
		});
		expect(typeof result.current.handlers.setPendingLocation).toBe('function');
		expect(typeof result.current.handlers.setIsSubmitting).toBe('function');
		expect(typeof result.current.handlers.setErrorCode).toBe('function');
	});

	it('updates state via handlers and keeps references stable', () => {
		const { result, rerender } = renderHook(() => usePickupLocationState());

		const handlersRef = result.current.handlers;
		const stateRef = result.current.state;

		act(() => {
			result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
		});
		act(() => {
			result.current.handlers.setIsSubmitting(true);
		});
		act(() => {
			result.current.handlers.setErrorCode('UNAUTHORIZED');
		});

		rerender();

		expect(result.current.state).toEqual({
			pendingLocation: { lat: 1, lng: 2 },
			isSubmitting: true,
			errorCode: 'UNAUTHORIZED'
		});
		expect(result.current.handlers).toBe(handlersRef);
		expect(result.current.state).not.toBe(stateRef);
	});
});
