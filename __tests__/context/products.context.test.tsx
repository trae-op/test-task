import { act, renderHook } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { Provider as ProductsProvider } from '@/app/_conceptions/Products/context';
import {
	useAdaptiveTableSelector,
	useAmountEntitiesSelector,
	useDeleteLoadingSelector,
	useEntityContext,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAdaptiveTableDispatch,
	useSetAllEntitiesDispatch,
	useSetDeleteLoadingDispatch,
	useSetListLoadingDispatch
} from '@/app/_conceptions/Products/context/useContext';

function createWrapper(props?: {
	isAdaptiveTable?: boolean;
	items?: Array<{ id?: string; [k: string]: unknown }>;
}) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<ProductsProvider
				isAdaptiveTable={props?.isAdaptiveTable}
				items={props?.items as any}
			>
				{children}
			</ProductsProvider>
		);
	};
}

function useProductsUnderTest() {
	const list = useListSelector();
	const amount = useAmountEntitiesSelector();
	const isLoading = useListLoadingSelector();
	const isDeleteLoading = useDeleteLoadingSelector();
	const isAdaptive = useAdaptiveTableSelector();

	const setAll = useSetAllEntitiesDispatch();
	const setListLoading = useSetListLoadingDispatch();
	const setDeleteLoading = useSetDeleteLoadingDispatch();
	const setAdaptiveTable = useSetAdaptiveTableDispatch();
	const remove = useRemoveDispatch();

	return {
		list,
		amount,
		isLoading,
		isDeleteLoading,
		isAdaptive,
		setAll,
		setListLoading,
		setDeleteLoading,
		setAdaptiveTable,
		remove
	};
}

describe('products context', () => {
	it('throws when used outside of Provider', () => {
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'Product useEntityContext must be used within a Provider'
		);
	});

	it('initializes from props and updates via dispatchers', () => {
		const wrapper = createWrapper({
			isAdaptiveTable: false,
			items: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }]
		});

		const { result } = renderHook(() => useProductsUnderTest(), { wrapper });

		expect(result.current.list.map(i => (i as any).id)).toEqual([
			'p1',
			'p2',
			'p3'
		]);
		expect(result.current.amount).toBe(3);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.isDeleteLoading).toBe(false);
		expect(result.current.isAdaptive).toBe(false);

		act(() => {
			result.current.setListLoading(false);
		});
		expect(result.current.isLoading).toBe(false);

		act(() => {
			result.current.setDeleteLoading(true);
		});
		expect(result.current.isDeleteLoading).toBe(true);

		act(() => {
			result.current.setAdaptiveTable(true);
		});
		expect(result.current.isAdaptive).toBe(true);

		act(() => {
			result.current.setAll([{ id: 'p9' }] as any);
		});
		expect(result.current.amount).toBe(1);
		expect(result.current.list.map(i => (i as any).id)).toEqual(['p9']);

		act(() => {
			result.current.remove('p9');
		});
		expect(result.current.amount).toBe(0);
		expect(result.current.list).toEqual([]);
	});

	it('dispatcher references stay stable across updates', () => {
		const wrapper = createWrapper({ items: [{ id: '1' }] });
		const { result } = renderHook(() => useProductsUnderTest(), { wrapper });

		const setAllRef = result.current.setAll;
		const setListLoadingRef = result.current.setListLoading;
		const setDeleteLoadingRef = result.current.setDeleteLoading;
		const setAdaptiveRef = result.current.setAdaptiveTable;
		const removeRef = result.current.remove;

		act(() => {
			result.current.setAll([{ id: '2' }] as any);
			result.current.setListLoading(false);
			result.current.setDeleteLoading(true);
			result.current.setAdaptiveTable(true);
			result.current.remove('2');
		});

		expect(result.current.setAll).toBe(setAllRef);
		expect(result.current.setListLoading).toBe(setListLoadingRef);
		expect(result.current.setDeleteLoading).toBe(setDeleteLoadingRef);
		expect(result.current.setAdaptiveTable).toBe(setAdaptiveRef);
		expect(result.current.remove).toBe(removeRef);
	});
});
