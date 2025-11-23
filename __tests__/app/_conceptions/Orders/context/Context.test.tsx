import { act, renderHook } from '@testing-library/react';
import React, { ReactNode, useContext } from 'react';

import { Context, Provider } from '@/app/_conceptions/Orders/context/Context';
import type { TEntity } from '@/app/_conceptions/Orders/context/types';

type ProviderWrapperProps = {
	children: ReactNode;
	items?: TEntity[];
	isAdaptiveTable?: boolean;
	entityId?: string;
};

function ProviderWrapper({
	children,
	items,
	isAdaptiveTable,
	entityId
}: ProviderWrapperProps) {
	return (
		<Provider
			items={items}
			isAdaptiveTable={isAdaptiveTable}
			entityId={entityId}
		>
			{children}
		</Provider>
	);
}

describe('Orders Context Provider', () => {
	test('provides initial list and supports setAll and remove', () => {
		const initialItems: TEntity[] = [
			{
				id: '1',
				title: 'Order 1',
				date: new Date('2020-01-01'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			},
			{
				id: '2',
				title: 'Order 2',
				date: new Date('2020-01-02'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			}
		];

		const { result } = renderHook(() => useContext(Context), {
			wrapper: ({ children }) => (
				<ProviderWrapper items={initialItems}>{children}</ProviderWrapper>
			)
		});

		if (!result.current) {
			throw new Error('Context should be defined');
		}

		const ctx = result.current;

		act(() => {
			ctx.setAll([
				{
					id: '2',
					title: 'Order 2',
					date: new Date('2020-01-01'),
					description: null,
					amountOfProducts: null,
					userId: 'user-1'
				},
				{
					id: '3',
					title: 'Order 3',
					date: new Date('2020-01-02'),
					description: null,
					amountOfProducts: null,
					userId: 'user-1'
				}
			]);
		});

		const listAfterSetAll = ctx.get();

		expect(listAfterSetAll).toHaveLength(2);
		expect(listAfterSetAll[0].id).toBe('2');

		act(() => {
			ctx.remove('2');
		});

		const listAfterRemove = ctx.get();
		expect(listAfterRemove).toHaveLength(1);
		expect(listAfterRemove[0].id).toBe('3');
	});

	test('tracks loading flags and adaptive table flag', () => {
		const { result } = renderHook(() => useContext(Context), {
			wrapper: ({ children }) => <ProviderWrapper>{children}</ProviderWrapper>
		});

		if (!result.current) {
			throw new Error('Context should be defined');
		}

		const ctx = result.current;

		act(() => {
			ctx.setListLoading(false);
			ctx.setDeleteLoading(true);
			ctx.setAdaptiveTable(true);
		});

		expect(ctx.isLoading()).toBe(false);
		expect(ctx.isDeleteLoading()).toBe(true);
		expect(ctx.hasAdaptiveTable()).toBe(true);
	});

	test('exposes entity id and amountEntities', () => {
		const items: TEntity[] = [
			{
				id: '10',
				title: 'Order 2',
				date: new Date('2020-01-01'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			},
			{
				id: '20',
				title: 'Order 3',
				date: new Date('2020-01-02'),
				description: null,
				amountOfProducts: null,
				userId: 'user-1'
			}
		];

		const { result } = renderHook(() => useContext(Context), {
			wrapper: ({ children }) => (
				<ProviderWrapper items={items} entityId='10'>
					{children}
				</ProviderWrapper>
			)
		});

		if (!result.current) {
			throw new Error('Context should be defined');
		}

		const ctx = result.current;

		expect(ctx.getEntityId()).toBe('10');
		expect(ctx.amountEntities()).toBe(2);
	});
});
