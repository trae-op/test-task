import { act, render, screen } from '@testing-library/react';
import { useContext, useEffect, useState } from 'react';

import {
	Context,
	Provider
} from '@/app/_conceptions/Settings/context/productType/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/productType/types';

const TestConsumer = () => {
	const ctx = useContext(Context);
	const [count, setCount] = useState(() => ctx?.get().length ?? 0);

	useEffect(() => {
		if (!ctx) return;
		const unsubscribe = ctx.subscribe(() => {
			setCount(ctx.get().length);
		});
		return unsubscribe;
	}, [ctx]);

	if (!ctx) {
		return null;
	}

	return (
		<div>
			<span data-testid='product-type-context-count'>{count}</span>
			<button
				data-testid='product-type-context-set-all'
				onClick={() =>
					ctx.setAll([
						{
							id: 'pt-2',
							title: 'Accessory',
							value: 'accessory'
						} as TEntity
					])
				}
			>
				SetAll
			</button>
			<button
				data-testid='product-type-context-remove'
				onClick={() => ctx.remove('pt-1')}
			>
				Remove
			</button>
		</div>
	);
};

describe('ProductType Context Provider', () => {
	const initialItems: TEntity[] = [
		{ id: 'pt-1', title: 'Device', value: 'device' } as TEntity
	];

	describe('positive cases', () => {
		test('renders consumer with initial items', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);
			expect(
				screen.getByTestId('product-type-context-count')
			).toHaveTextContent('1');
		});
	});

	describe('negative cases', () => {
		test('removing matches reduces count to zero', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			act(() => {
				screen.getByTestId('product-type-context-remove').click();
			});
			expect(
				screen.getByTestId('product-type-context-count')
			).toHaveTextContent('0');
		});
	});

	describe('edge cases', () => {
		test('setAll replaces list data', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			act(() => {
				screen.getByTestId('product-type-context-set-all').click();
			});
			expect(
				screen.getByTestId('product-type-context-count')
			).toHaveTextContent('1');
		});
	});
});
