import { act, render, screen } from '@testing-library/react';
import { useContext, useEffect, useState } from 'react';

import {
	Context,
	Provider
} from '@/app/_conceptions/Settings/context/currency/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/currency/types';

const TestConsumer = () => {
	const ctx = useContext(Context);
	const [count, setCount] = useState(() => ctx?.get().length ?? 0);
	const [loading, setLoading] = useState(() => ctx?.isLoading() ?? true);

	useEffect(() => {
		if (!ctx) return;
		const unsubscribe = ctx.subscribe(() => {
			setCount(ctx.get().length);
			setLoading(ctx.isLoading());
		});
		return unsubscribe;
	}, [ctx]);

	if (!ctx) {
		return null;
	}

	return (
		<div>
			<span data-testid='currency-context-count'>{count}</span>
			<span data-testid='currency-context-loading'>
				{loading ? 'loading' : 'ready'}
			</span>
			<button
				data-testid='currency-context-set-all'
				onClick={() =>
					ctx.setAll([
						{
							id: 'two',
							title: 'Euro',
							value: 'EUR'
						} as TEntity
					])
				}
			>
				SetAll
			</button>
			<button
				data-testid='currency-context-remove'
				onClick={() => ctx.remove('curr-1')}
			>
				Remove
			</button>
			<button
				data-testid='currency-context-loading-toggle'
				onClick={() => ctx.setListLoading(false)}
			>
				ToggleLoading
			</button>
		</div>
	);
};

describe('Currency Context Provider', () => {
	const initialItems: TEntity[] = [
		{ id: 'curr-1', title: 'Dollar', value: 'USD' } as TEntity
	];

	describe('positive cases', () => {
		test('exposes initial state via consumer', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			expect(screen.getByTestId('currency-context-count')).toHaveTextContent(
				'1'
			);
			expect(screen.getByTestId('currency-context-loading')).toHaveTextContent(
				'loading'
			);
		});
	});

	describe('negative cases', () => {
		test('removing unknown entity keeps state unchanged', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			act(() => {
				screen.getByTestId('currency-context-remove').click();
			});
			// remove existing id reduces count to zero
			expect(screen.getByTestId('currency-context-count')).toHaveTextContent(
				'0'
			);

			act(() => {
				screen.getByTestId('currency-context-remove').click();
			});
			expect(screen.getByTestId('currency-context-count')).toHaveTextContent(
				'0'
			);
		});
	});

	describe('edge cases', () => {
		test('setAll and loading dispatchers notify subscribers', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			act(() => {
				screen.getByTestId('currency-context-set-all').click();
			});
			expect(screen.getByTestId('currency-context-count')).toHaveTextContent(
				'1'
			);

			act(() => {
				screen.getByTestId('currency-context-loading-toggle').click();
			});
			expect(screen.getByTestId('currency-context-loading')).toHaveTextContent(
				'ready'
			);
		});
	});
});
