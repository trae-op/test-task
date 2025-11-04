import { act, renderHook } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { Provider as OrdersProvider } from '@/context/orders';
import {
	useAdaptiveTableSelector,
	useAmountEntitiesSelector,
	useDeleteLoadingSelector,
	useEntityContext,
	useEntityIdSelector,
	useListLoadingSelector,
	useListSelector,
	useRemoveDispatch,
	useSetAdaptiveTableDispatch,
	useSetAllEntitiesDispatch,
	useSetDeleteLoadingDispatch,
	useSetListLoadingDispatch
} from '@/context/orders/useContext';

function createWrapper(props?: {
	isAdaptiveTable?: boolean;
	entityId?: string;
	items?: Array<{ id?: string; [k: string]: unknown }>;
}) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<OrdersProvider
				isAdaptiveTable={props?.isAdaptiveTable}
				entityId={props?.entityId}
				items={props?.items as any}
			>
				{children}
			</OrdersProvider>
		);
	};
}

function useOrdersUnderTest() {
	const list = useListSelector();
	const amount = useAmountEntitiesSelector();
	const isLoading = useListLoadingSelector();
	const isDeleteLoading = useDeleteLoadingSelector();
	const isAdaptive = useAdaptiveTableSelector();
	const entityId = useEntityIdSelector();

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
		entityId,
		setAll,
		setListLoading,
		setDeleteLoading,
		setAdaptiveTable,
		remove
	};
}

describe('orders context', () => {
	it('throws when used outside of Provider', () => {
		expect(() => renderHook(() => useEntityContext())).toThrow(
			'Orders useEntityContext must be used within a Provider'
		);
	});

	it('initializes from props and updates via dispatchers', () => {
		const wrapper = createWrapper({
			isAdaptiveTable: true,
			entityId: 'order-1',
			items: [
				{ id: '1', any: 'x' },
				{ id: '2', any: 'y' }
			]
		});

		const { result } = renderHook(() => useOrdersUnderTest(), { wrapper });

		// initial
		expect(result.current.list.map(i => (i as any).id)).toEqual(['1', '2']);
		expect(result.current.amount).toBe(2);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.isDeleteLoading).toBe(false);
		expect(result.current.isAdaptive).toBe(true);
		expect(result.current.entityId).toBe('order-1');

		// set list loading false
		act(() => {
			result.current.setListLoading(false);
		});
		expect(result.current.isLoading).toBe(false);

		// set delete loading true
		act(() => {
			result.current.setDeleteLoading(true);
		});
		expect(result.current.isDeleteLoading).toBe(true);

		// set adaptive table false
		act(() => {
			result.current.setAdaptiveTable(false);
		});
		expect(result.current.isAdaptive).toBe(false);

		// replace list
		act(() => {
			result.current.setAll([{ id: '3' } as any]);
		});
		expect(result.current.amount).toBe(1);
		expect(result.current.list.map(i => (i as any).id)).toEqual(['3']);

		// remove by id
		act(() => {
			result.current.remove('3');
		});
		expect(result.current.amount).toBe(0);
		expect(result.current.list).toEqual([]);
	});

	it('dispatcher references stay stable across updates', () => {
		const wrapper = createWrapper({ items: [{ id: '1' }] });
		const { result } = renderHook(() => useOrdersUnderTest(), { wrapper });

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
