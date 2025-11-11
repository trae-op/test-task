import { act, renderHook } from '@testing-library/react';
import React, { type PropsWithChildren } from 'react';

import { Provider } from '@/context/pickupLocation';
import {
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/context/pickupLocation/useContext';

const createEntity = (id: string) => ({
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

const createWrapper =
	(items?: ReturnType<typeof createEntity>[]) =>
	({ children }: PropsWithChildren) => (
		<Provider items={items}>{children}</Provider>
	);

const usePickupLocationContextUnderTest = () => {
	const entityContext = useEntityContext();
	const list = useListSelector();
	const isLoading = useListLoadingSelector();
	const setAll = useSetAllDispatch();
	const setListLoading = useSetListLoadingDispatch();

	return { entityContext, list, isLoading, setAll, setListLoading };
};

describe('context/pickupLocation', () => {
	it('throws when useEntityContext called outside provider', () => {
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'PickupLocation useEntityContext must be used within a Provider'
		);
	});

	it('initializes with provided items and toggles loading state', () => {
		const initialEntity = createEntity('loc-1');
		const wrapper = createWrapper([initialEntity]);
		const { result } = renderHook(() => usePickupLocationContextUnderTest(), {
			wrapper
		});

		expect(result.current.list.map(item => item.id)).toEqual(['loc-1']);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.entityContext.get()).toEqual([initialEntity]);

		act(() => {
			result.current.setListLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.entityContext.isLoading()).toBe(false);
	});

	it('updates list via setAll dispatcher and keeps references stable', () => {
		const initialEntity = createEntity('loc-1');
		const wrapper = createWrapper([initialEntity]);
		const { result } = renderHook(() => usePickupLocationContextUnderTest(), {
			wrapper
		});

		const initialSetAll = result.current.setAll;
		const initialSetListLoading = result.current.setListLoading;

		const nextEntity = createEntity('loc-2');
		act(() => {
			result.current.setAll([nextEntity]);
		});

		expect(result.current.list.map(item => item.id)).toEqual(['loc-2']);
		expect(result.current.entityContext.get()).toEqual([nextEntity]);

		act(() => {
			result.current.setListLoading(true);
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.setAll).toBe(initialSetAll);
		expect(result.current.setListLoading).toBe(initialSetListLoading);
	});
});
