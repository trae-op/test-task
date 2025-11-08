import { act, renderHook } from '@testing-library/react';
import React, { type PropsWithChildren } from 'react';

import { Provider as ProductTypeProvider } from '@/context/productType';
import {
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAllDispatch,
	useSetListLoadingDispatch
} from '@/context/productType/useContext';

function createWrapper(props?: {
	items?: Array<{ id: string; [k: string]: unknown }>;
}) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<ProductTypeProvider items={props?.items as any}>
				{children}
			</ProductTypeProvider>
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

describe('productType context', () => {
	it('throws when used outside Provider', () => {
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'ProductType useEntityContext must be used within a Provider'
		);
	});

	it('initializes from props and updates via dispatchers', () => {
		const wrapper = createWrapper({ items: [{ id: 't1' }, { id: 't2' }] });
		const { result } = renderHook(() => useUnderTest(), { wrapper });

		expect(result.current.list.map((x: any) => x.id)).toEqual(['t1', 't2']);
		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setListLoading(false);
		});
		expect(result.current.isLoading).toBe(false);

		act(() => {
			result.current.setAll([{ id: 't9' }] as any);
		});
		expect(result.current.list.map((x: any) => x.id)).toEqual(['t9']);

		act(() => {
			result.current.remove('t9');
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
