import { act, renderHook } from '@testing-library/react';

import { TPickupLocation } from '@/types/pickupLocation';

import { addPickupLocation } from '@/app/_conceptions/Settings/actions/pickupLocation';
import type {
	TPickupLocationState,
	TPickupLocationStateHandlers
} from '@/app/_conceptions/Settings/hooks/pickupLocation/types';
import { usePickupLocationActions } from '@/app/_conceptions/Settings/hooks/pickupLocation/usePickupLocationActions';

jest.mock('@/app/_conceptions/Settings/actions/pickupLocation', () => ({
	addPickupLocation: jest.fn()
}));

type TSetupParams = {
	state?: Partial<TPickupLocationState>;
	handlers?: Partial<TPickupLocationStateHandlers>;
	rawItems?: TPickupLocation[];
	setAll?: (items: TPickupLocation[]) => void;
};

const buildPickup = (
	overrides: Partial<TPickupLocation> = {}
): TPickupLocation => ({
	id: 'loc-1',
	latitude: 0,
	longitude: 0,
	country: null,
	state: null,
	city: null,
	district: null,
	street: null,
	postcode: null,
	displayName: null,
	userId: 'user-1',
	...overrides
});

const setupHook = ({
	state: stateOverride = {},
	handlers: handlerOverride = {},
	rawItems = [buildPickup()],
	setAll = jest.fn()
}: TSetupParams = {}) => {
	const state: TPickupLocationState = {
		pendingLocation: undefined,
		isSubmitting: false,
		errorCode: undefined,
		...stateOverride
	};

	const handlerMocks: TPickupLocationStateHandlers = {
		setPendingLocation: jest.fn(),
		setIsSubmitting: jest.fn(),
		setErrorCode: jest.fn(),
		...handlerOverride
	};

	const hook = renderHook(() =>
		usePickupLocationActions({
			state,
			handlers: handlerMocks,
			rawItems,
			setAll
		})
	);

	return { hook, state, handlerMocks, setAll };
};

describe('usePickupLocationActions', () => {
	const addPickupLocationMock = addPickupLocation as jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('positive cases', () => {
		test('handleApply saves location and updates list', async () => {
			const pendingLocation = { lat: 1, lng: 2 };
			const onClose = jest.fn();
			const created = buildPickup({ id: 'loc-2', latitude: 1, longitude: 2 });

			addPickupLocationMock.mockResolvedValue({ ok: true, item: created });

			const setAll = jest.fn();
			const { hook, handlerMocks } = setupHook({
				state: { pendingLocation },
				setAll
			});

			await act(async () => {
				await hook.result.current.handleApply(onClose);
			});

			expect(addPickupLocationMock).toHaveBeenCalledWith(pendingLocation);
			expect(setAll).toHaveBeenCalledWith(expect.arrayContaining([created]));
			expect(handlerMocks.setPendingLocation).toHaveBeenCalledWith(undefined);
			expect(handlerMocks.setIsSubmitting).toHaveBeenCalledTimes(2);
			expect(onClose).toHaveBeenCalled();
		});
	});

	describe('negative cases', () => {
		test('handleApply rejects when location missing', async () => {
			const { hook, handlerMocks } = setupHook();

			await act(async () => {
				await hook.result.current.handleApply(jest.fn());
			});

			expect(handlerMocks.setErrorCode).toHaveBeenCalledWith(
				'LOCATION_NOT_SELECTED'
			);
			expect(addPickupLocationMock).not.toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		test('propagates server error codes and merges existing entities', async () => {
			const rawItems = [buildPickup({ id: 'loc-9' })];
			addPickupLocationMock
				.mockResolvedValueOnce({ ok: false, code: 'SERVER_ERROR' })
				.mockResolvedValueOnce({
					ok: true,
					item: buildPickup({ id: 'loc-9', latitude: 5 })
				});

			const { hook, handlerMocks, setAll } = setupHook({
				state: { pendingLocation: { lat: 3, lng: 4 } },
				rawItems
			});

			await act(async () => {
				await hook.result.current.handleApply(jest.fn());
			});
			expect(handlerMocks.setErrorCode).toHaveBeenCalledWith('SERVER_ERROR');

			await act(async () => {
				await hook.result.current.handleApply(jest.fn());
			});

			expect(setAll).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ id: 'loc-9', latitude: 5 })
				])
			);
		});
	});
});
