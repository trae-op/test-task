import { act, renderHook } from '@testing-library/react';

import { usePopup } from '@/hooks/popup';

describe('usePopup', () => {
	it('returns initial state: closed with no entityId', () => {
		const { result } = renderHook(() => usePopup());

		expect(result.current.isOpen).toBe(false);
		expect(result.current.entityId).toBeUndefined();
		expect(typeof result.current.handleOpen).toBe('function');
		expect(typeof result.current.handleClose).toBe('function');
	});

	it('opens with provided entity id', () => {
		const { result } = renderHook(() => usePopup());

		act(() => {
			result.current.handleOpen('abc-123');
		});

		expect(result.current.isOpen).toBe(true);
		expect(result.current.entityId).toBe('abc-123');
	});

	it('opens without entity id (optional) and sets id to undefined', () => {
		const { result } = renderHook(() => usePopup());

		act(() => {
			result.current.handleOpen();
		});

		expect(result.current.isOpen).toBe(true);
		expect(result.current.entityId).toBeUndefined();
	});

	it('closes and clears entity id', () => {
		const { result } = renderHook(() => usePopup());

		act(() => {
			result.current.handleOpen('to-close');
		});

		act(() => {
			result.current.handleClose();
		});

		expect(result.current.isOpen).toBe(false);
		expect(result.current.entityId).toBeUndefined();
	});

	it('keeps stable action references across state changes', () => {
		const { result } = renderHook(() => usePopup());

		const openRef = result.current.handleOpen;
		const closeRef = result.current.handleClose;

		act(() => {
			result.current.handleOpen('x');
		});

		act(() => {
			result.current.handleClose();
		});

		expect(result.current.handleOpen).toBe(openRef);
		expect(result.current.handleClose).toBe(closeRef);
	});

	it('does not throw when closing while already closed', () => {
		const { result } = renderHook(() => usePopup());

		expect(() => {
			act(() => {
				result.current.handleClose();
			});
		}).not.toThrow();

		expect(result.current.isOpen).toBe(false);
		expect(result.current.entityId).toBeUndefined();
	});

	it('allows reopening and changing entityId without errors', () => {
		const { result } = renderHook(() => usePopup());

		act(() => {
			result.current.handleOpen('first');
		});

		expect(result.current.isOpen).toBe(true);
		expect(result.current.entityId).toBe('first');

		expect(() => {
			act(() => {
				result.current.handleOpen('second');
			});
		}).not.toThrow();

		expect(result.current.isOpen).toBe(true);
		expect(result.current.entityId).toBe('second');
	});
});
