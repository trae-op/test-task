import { act, renderHook } from '@testing-library/react';
import React, { type PropsWithChildren } from 'react';

import { Provider as CurrencyProvider } from '@/context/currency';
import {
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/context/currency/useContext';

function createWrapper(props?: {
	items?: Array<{ id: string; [k: string]: unknown }>;
}) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<CurrencyProvider items={props?.items as any}>
				{children}
			</CurrencyProvider>
		);
	};
}

function useUnderTest() {
	const list = useListSelector();
	const isLoading = useListLoadingSelector();

	const setAll = useSetAllDispatch();
	const setListLoading = useSetListLoadingDispatch();
	const remove = useRemoveDispatch();

	return {
		list,
		isLoading,
		setAll,
		setListLoading,
		remove
	};
}

describe('currency context', () => {
	it('throws when used outside Provider', () => {
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'Currency useEntityContext must be used within a Provider'
		);
	});

	it('initializes from props and updates via dispatchers', () => {
		const wrapper = createWrapper({ items: [{ id: 'c1' }, { id: 'c2' }] });
		const { result } = renderHook(() => useUnderTest(), { wrapper });

		expect(result.current.list.map((x: any) => x.id)).toEqual(['c1', 'c2']);
		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setListLoading(false);
		});
		expect(result.current.isLoading).toBe(false);

		act(() => {
			result.current.setAll([{ id: 'c9' }] as any);
		});
		expect(result.current.list.map((x: any) => x.id)).toEqual(['c9']);

		act(() => {
			result.current.remove('c9');
		});
		expect(result.current.list).toEqual([]);
	});

	it('dispatcher references stay stable', () => {
		const wrapper = createWrapper({ items: [{ id: 'x' }] });
		const { result } = renderHook(() => useUnderTest(), { wrapper });

		const setAllRef = result.current.setAll;
		const setListLoadingRef = result.current.setListLoading;
		const removeRef = result.current.remove;

		act(() => {
			result.current.setAll([] as any);
			result.current.setListLoading(false);
			result.current.remove('x');
		});

		expect(result.current.setAll).toBe(setAllRef);
		expect(result.current.setListLoading).toBe(setListLoadingRef);
		expect(result.current.remove).toBe(removeRef);
	});
});
