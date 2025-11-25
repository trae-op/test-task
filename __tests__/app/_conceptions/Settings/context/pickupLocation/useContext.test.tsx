import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Provider } from '@/app/_conceptions/Settings/context/pickupLocation/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/pickupLocation/types';
import { useEntityContext } from '@/app/_conceptions/Settings/context/pickupLocation/useContext';
import {
	useListLoadingSelector,
	useListSelector,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/app/_conceptions/Settings/context/pickupLocation/useSelectors';

describe('pickup location useContext hooks', () => {
	const initialItems: TEntity[] = [
		{ id: 'loc-1', latitude: 0, longitude: 0 } as TEntity
	];

	const wrapper = ({ children }: { children: ReactNode }) => (
		<Provider items={initialItems}>{children}</Provider>
	);

	describe('negative cases', () => {
		test('throws when used outside provider', () => {
			expect(() => renderHook(() => useEntityContext())).toThrow(
				'PickupLocation useEntityContext must be used within a Provider'
			);
		});
	});

	describe('positive cases', () => {
		test('setAll updates selector value', () => {
			const { result } = renderHook(
				() => ({ list: useListSelector(), setAll: useSetAllDispatch() }),
				{ wrapper }
			);

			expect(result.current.list).toHaveLength(1);

			act(() => {
				result.current.setAll([
					...result.current.list,
					{ id: 'loc-2', latitude: 1, longitude: 1 } as TEntity
				]);
			});

			expect(result.current.list).toHaveLength(2);
		});
	});

	describe('edge cases', () => {
		test('loading selector reflects dispatcher changes', () => {
			const { result } = renderHook(
				() => ({
					loading: useListLoadingSelector(),
					setLoading: useSetListLoadingDispatch()
				}),
				{ wrapper }
			);

			expect(result.current.loading).toBe(true);

			act(() => {
				result.current.setLoading(false);
			});
			expect(result.current.loading).toBe(false);
		});
	});
});
