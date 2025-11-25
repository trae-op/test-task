import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Provider } from '@/app/_conceptions/Settings/context/currency/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/currency/types';
import {
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/app/_conceptions/Settings/context/currency/useSelectors';

describe('currency useContext hooks', () => {
	const initialItems: TEntity[] = [
		{ id: 'cur-1', title: 'Dollar', value: 'USD' } as TEntity
	];

	const wrapper = ({ children }: { children: ReactNode }) => (
		<Provider items={initialItems}>{children}</Provider>
	);

	describe('negative cases', () => {
		test('useEntityContext throws outside provider', () => {
			expect(() => renderHook(() => useEntityContext())).toThrow(
				'Currency useEntityContext must be used within a Provider'
			);
		});
	});

	describe('positive cases', () => {
		test('selectors return state and react to setAll', () => {
			const { result } = renderHook(
				() => {
					return {
						list: useListSelector(),
						setAll: useSetAllDispatch()
					};
				},
				{ wrapper }
			);

			expect(result.current.list).toHaveLength(1);

			act(() => {
				result.current.setAll([
					...result.current.list,
					{ id: 'cur-2', title: 'Euro', value: 'EUR' } as TEntity
				]);
			});

			expect(result.current.list).toHaveLength(2);
		});
	});

	describe('edge cases', () => {
		test('loading and remove dispatchers notify subscribers', () => {
			const { result } = renderHook(
				() =>
					({
						isLoading: useListLoadingSelector(),
						setLoading: useSetListLoadingDispatch(),
						remove: useRemoveDispatch(),
						list: useListSelector()
					}) as const,
				{ wrapper }
			);

			expect(result.current.isLoading).toBe(true);

			act(() => {
				result.current.setLoading(false);
			});
			expect(result.current.isLoading).toBe(false);

			act(() => {
				result.current.remove('cur-1');
			});
			expect(result.current.list).toHaveLength(0);
		});
	});
});
