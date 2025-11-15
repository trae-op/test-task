import { act, renderHook } from '@testing-library/react';
import React, { ReactNode, useContext } from 'react';

import { Context, Provider } from '@/app/_conceptions/Products/context/Context';
import type {
	TContext,
	TEntity
} from '@/app/_conceptions/Products/context/types';

interface TestWrapperProps {
	children: ReactNode;
	items?: TEntity[];
	isAdaptiveTable?: boolean;
}

const createWrapper =
	({ items, isAdaptiveTable }: Omit<TestWrapperProps, 'children'>) =>
	({ children }: { children: ReactNode }) => (
		<Provider items={items} isAdaptiveTable={isAdaptiveTable}>
			{children}
		</Provider>
	);

describe('Products Context Provider', () => {
	test('provides initial items via get and amountEntities', () => {
		const items: TEntity[] = [
			{ id: '1', title: 'A' },
			{ id: '2', title: 'B' }
		];

		const wrapper = createWrapper({ items });

		const { result } = renderHook(() => useContext(Context) as TContext, {
			wrapper
		});

		expect(result.current.get()).toEqual(items);
		expect(result.current.amountEntities()).toBe(2);
	});

	test('remove updates list and notifies subscribers', () => {
		const items: TEntity[] = [
			{ id: '1', title: 'A' },
			{ id: '2', title: 'B' }
		];

		const wrapper = createWrapper({ items });

		const { result } = renderHook(() => useContext(Context) as TContext, {
			wrapper
		});

		let notified = false;
		act(() => {
			result.current.subscribe(() => {
				notified = true;
			});
			result.current.remove('1');
		});

		expect(result.current.get()).toEqual([{ id: '2', title: 'B' }]);
		expect(notified).toBe(true);
	});

	test('setAdaptiveTable and hasAdaptiveTable work together', () => {
		const wrapper = createWrapper({ items: [], isAdaptiveTable: false });

		const { result } = renderHook(() => useContext(Context) as TContext, {
			wrapper
		});

		act(() => {
			result.current.setAdaptiveTable(true);
		});

		expect(result.current.hasAdaptiveTable()).toBe(true);
	});
});
