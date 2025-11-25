import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Provider } from '@/app/_conceptions/Settings/context/productType/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/productType/types';
import {
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/app/_conceptions/Settings/context/productType/useSelectors';

describe('product type useContext hooks', () => {
	const initialItems: TEntity[] = [
		{ id: 'pt-1', title: 'Device', value: 'device' } as TEntity
	];

	const wrapper = ({ children }: { children: ReactNode }) => (
		<Provider items={initialItems}>{children}</Provider>
	);

	describe('negative cases', () => {
		test('throws when context missing', () => {
			expect(() => renderHook(() => useEntityContext())).toThrow(
				'ProductType useEntityContext must be used within a Provider'
			);
		});
	});

	describe('positive cases', () => {
		test('setAll adjusts selector list', () => {
			const { result } = renderHook(
				() => ({ list: useListSelector(), setAll: useSetAllDispatch() }),
				{ wrapper }
			);

			expect(result.current.list).toHaveLength(1);

			act(() => {
				result.current.setAll([
					...result.current.list,
					{ id: 'pt-2', title: 'Accessory', value: 'accessory' } as TEntity
				]);
			});

			expect(result.current.list).toHaveLength(2);
		});
	});

	describe('edge cases', () => {
		test('loading selector updates and remove dispatcher works', () => {
			const { result } = renderHook(
				() => ({
					loading: useListLoadingSelector(),
					setLoading: useSetListLoadingDispatch(),
					remove: useRemoveDispatch(),
					list: useListSelector()
				}),
				{ wrapper }
			);

			expect(result.current.loading).toBe(true);

			act(() => {
				result.current.setLoading(false);
			});
			expect(result.current.loading).toBe(false);

			act(() => {
				result.current.remove('pt-1');
			});
			expect(result.current.list).toHaveLength(0);
		});
	});
});
