import { renderHook } from '@testing-library/react';

import { usePickupLocation } from '@/app/_conceptions/Settings/hooks/pickupLocation';

jest.mock('@/hooks/settings/pickupLocation/usePickupLocationState', () => ({
	usePickupLocationState: jest.fn()
}));

jest.mock('@/hooks/settings/pickupLocation/usePickupLocationActions', () => ({
	usePickupLocationActions: jest.fn()
}));

jest.mock('@/context/pickupLocation/useContext', () => ({
	useListSelector: jest.fn(),
	useSetAllDispatch: jest.fn()
}));

jest.mock('@/utils/map', () => ({
	formatLocationLabel: jest.fn(),
	toLocationFormValue: jest.fn()
}));

const { usePickupLocationState } = jest.requireMock(
	'@/hooks/settings/pickupLocation/usePickupLocationState'
);
const { usePickupLocationActions } = jest.requireMock(
	'@/hooks/settings/pickupLocation/usePickupLocationActions'
);
const { useListSelector, useSetAllDispatch } = jest.requireMock(
	'@/context/pickupLocation/useContext'
);
const { formatLocationLabel, toLocationFormValue } =
	jest.requireMock('@/utils/map');

describe('hooks/settings/pickupLocation/usePickupLocation', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('combines state, actions, and formatted items', () => {
		const state = {
			state: {
				pendingLocation: { lat: 1, lng: 2 },
				isSubmitting: false,
				errorCode: undefined
			},
			handlers: { dummy: true }
		};
		const actions = {
			handleApply: jest.fn(),
			handleOpen: jest.fn(),
			handleSelectLocation: jest.fn(),
			handleSuccessfulLocation: jest.fn(),
			clearError: jest.fn()
		};
		(usePickupLocationState as jest.Mock).mockReturnValue(state);
		(usePickupLocationActions as jest.Mock).mockReturnValue(actions);
		(useListSelector as jest.Mock).mockReturnValue([
			{ id: 'loc-1', raw: true }
		]);
		(useSetAllDispatch as jest.Mock).mockReturnValue(jest.fn());
		(toLocationFormValue as jest.Mock).mockReturnValue({ lat: 10, lng: 20 });
		(formatLocationLabel as jest.Mock).mockReturnValue('Kyiv, Ukraine');

		const { result } = renderHook(() => usePickupLocation());

		expect(result.current).toEqual({
			pendingLocation: { lat: 1, lng: 2 },
			isSubmitting: false,
			errorCode: undefined,
			...actions,
			items: [
				{
					id: 'loc-1',
					location: { lat: 10, lng: 20 },
					label: 'Kyiv, Ukraine',
					entity: { id: 'loc-1', raw: true }
				}
			]
		});

		expect(usePickupLocationActions).toHaveBeenCalledWith({
			state: state.state,
			handlers: state.handlers,
			rawItems: [{ id: 'loc-1', raw: true }],
			setAll: expect.any(Function)
		});
		expect(toLocationFormValue).toHaveBeenCalledWith({
			id: 'loc-1',
			raw: true
		});
		expect(formatLocationLabel).toHaveBeenCalledWith({ lat: 10, lng: 20 });
	});
});
