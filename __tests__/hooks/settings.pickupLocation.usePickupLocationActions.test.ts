import { act, renderHook } from '@testing-library/react';

import { usePickupLocationActions } from '@/hooks/settings/pickupLocation/usePickupLocationActions';
import { usePickupLocationState } from '@/hooks/settings/pickupLocation/usePickupLocationState';

import type { TPickupLocation } from '@/types/pickupLocation';

jest.mock('@/actions/pickupLocation', () => ({
	addPickupLocation: jest.fn()
}));

const { addPickupLocation } = jest.requireMock('@/actions/pickupLocation');

const createEntity = (id: string): TPickupLocation => ({
	id,
	latitude: 50,
	longitude: 30,
	country: null,
	state: null,
	city: null,
	district: null,
	street: null,
	postcode: null,
	displayName: null,
	userId: 'user-1'
});

type TWrapperProps = {
	rawItems: TPickupLocation[];
	setAll: jest.Mock;
};

describe('hooks/settings/pickupLocation/usePickupLocationActions', () => {
	const setup = (props: TWrapperProps) =>
		renderHook(
			({ rawItems, setAll }: TWrapperProps) => {
				const { state, handlers } = usePickupLocationState();
				const actions = usePickupLocationActions({
					state,
					handlers,
					rawItems,
					setAll
				});
				return { state, handlers, actions };
			},
			{ initialProps: props }
		);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('assigns location on handleSuccessfulLocation and handleSelectLocation', () => {
		const location = { lat: 1, lng: 2 };
		const utils = setup({ rawItems: [], setAll: jest.fn() });

		act(() => {
			utils.result.current.actions.handleSuccessfulLocation(location);
		});
		expect(utils.result.current.state.pendingLocation).toEqual(location);
		expect(utils.result.current.state.errorCode).toBeUndefined();

		act(() => {
			utils.result.current.actions.handleSelectLocation({ lat: 3, lng: 4 });
		});
		expect(utils.result.current.state.pendingLocation).toEqual({
			lat: 3,
			lng: 4
		});
	});

	it('clears state on handleOpen', () => {
		const utils = setup({ rawItems: [], setAll: jest.fn() });

		act(() => {
			utils.result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
			utils.result.current.handlers.setErrorCode('UNAUTHORIZED');
			utils.result.current.actions.handleOpen();
		});

		expect(utils.result.current.state.pendingLocation).toBeUndefined();
		expect(utils.result.current.state.errorCode).toBeUndefined();
	});

	it('sets LOCATION_NOT_SELECTED when applying without location', async () => {
		const utils = setup({ rawItems: [], setAll: jest.fn() });

		await act(async () => {
			await utils.result.current.actions.handleApply(jest.fn());
		});

		expect(utils.result.current.state.errorCode).toBe('LOCATION_NOT_SELECTED');
		expect(addPickupLocation).not.toHaveBeenCalled();
	});

	it('persists new location and closes popup on success', async () => {
		const setAll = jest.fn();
		const rawItems = [createEntity('existing')];
		const createdEntity = createEntity('created');
		(addPickupLocation as jest.Mock).mockResolvedValue({
			ok: true,
			item: createdEntity
		});
		const onClose = jest.fn();
		const utils = setup({ rawItems, setAll });

		act(() => {
			utils.result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
		});

		await act(async () => {
			await utils.result.current.actions.handleApply(onClose);
		});

		expect(addPickupLocation).toHaveBeenCalledWith({ lat: 1, lng: 2 });
		expect(setAll).toHaveBeenCalledWith([createdEntity, ...rawItems]);
		expect(utils.result.current.state.pendingLocation).toBeUndefined();
		expect(utils.result.current.state.isSubmitting).toBe(false);
		expect(onClose).toHaveBeenCalled();
	});

	it('replaces existing entry when ids match', async () => {
		const setAll = jest.fn();
		const rawItems = [createEntity('existing')];
		(addPickupLocation as jest.Mock).mockResolvedValue({
			ok: true,
			item: { ...createEntity('existing'), latitude: 60 }
		});
		const utils = setup({ rawItems, setAll });

		act(() => {
			utils.result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
		});

		await act(async () => {
			await utils.result.current.actions.handleApply(jest.fn());
		});

		expect(setAll).toHaveBeenCalledWith([
			{ ...createEntity('existing'), latitude: 60 }
		]);
	});

	it('surfaces error codes when action fails', async () => {
		const setAll = jest.fn();
		(addPickupLocation as jest.Mock).mockResolvedValue({
			ok: false,
			code: 'UNAUTHORIZED'
		});
		const utils = setup({ rawItems: [], setAll });

		act(() => {
			utils.result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
		});

		await act(async () => {
			await utils.result.current.actions.handleApply(jest.fn());
		});

		expect(utils.result.current.state.errorCode).toBe('UNAUTHORIZED');
		expect(setAll).not.toHaveBeenCalled();
	});

	it('sets SERVER_ERROR when action throws', async () => {
		const setAll = jest.fn();
		(addPickupLocation as jest.Mock).mockRejectedValue(new Error('boom'));
		const utils = setup({ rawItems: [], setAll });

		act(() => {
			utils.result.current.handlers.setPendingLocation({ lat: 1, lng: 2 });
		});

		await act(async () => {
			await utils.result.current.actions.handleApply(jest.fn());
		});

		expect(utils.result.current.state.errorCode).toBe('SERVER_ERROR');
		expect(setAll).not.toHaveBeenCalled();
	});
});
