import { act, render, screen } from '@testing-library/react';
import { useContext, useEffect, useState } from 'react';

import {
	Context,
	Provider
} from '@/app/_conceptions/Settings/context/pickupLocation/Context';
import type { TEntity } from '@/app/_conceptions/Settings/context/pickupLocation/types';

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
			<span data-testid='pickup-context-count'>{count}</span>
			<span data-testid='pickup-context-loading'>
				{loading ? 'loading' : 'ready'}
			</span>
			<button
				data-testid='pickup-context-set-all'
				onClick={() =>
					ctx.setAll([
						{
							id: 'loc-2',
							latitude: 1,
							longitude: 2
						} as TEntity
					])
				}
			>
				SetAll
			</button>
			<button
				data-testid='pickup-context-loading-toggle'
				onClick={() => ctx.setListLoading(false)}
			>
				Toggle
			</button>
		</div>
	);
};

describe('PickupLocation Context Provider', () => {
	const initialItems: TEntity[] = [
		{ id: 'loc-1', latitude: 0, longitude: 0 } as TEntity
	];

	describe('positive cases', () => {
		test('renders items and exposes loading', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);
			expect(screen.getByTestId('pickup-context-count')).toHaveTextContent('1');
			expect(screen.getByTestId('pickup-context-loading')).toHaveTextContent(
				'loading'
			);
		});
	});

	describe('edge cases', () => {
		test('setAll and loading updates propagate to subscribers', () => {
			render(
				<Provider items={initialItems}>
					<TestConsumer />
				</Provider>
			);

			act(() => screen.getByTestId('pickup-context-set-all').click());
			expect(screen.getByTestId('pickup-context-count')).toHaveTextContent('1');

			act(() => screen.getByTestId('pickup-context-loading-toggle').click());
			expect(screen.getByTestId('pickup-context-loading')).toHaveTextContent(
				'ready'
			);
		});
	});
});
