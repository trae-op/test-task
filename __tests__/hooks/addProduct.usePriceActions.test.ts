import { act, renderHook } from '@testing-library/react';

import { usePriceActions } from '@/hooks/addProduct/usePriceActions';

describe('addProduct/usePriceActions', () => {
	it('validates and adds prices, managing default correctly', () => {
		const { result } = renderHook(() => usePriceActions());

		// invalid: no currency
		act(() => {
			result.current.setAmount('10');
			result.current.setIsDefault(true);
			result.current.handleAddPrice();
		});
		expect(result.current.prices).toHaveLength(0);

		// add USD default (split updates to avoid stale closures)
		act(() => {
			result.current.setCurrency('USD');
		});
		act(() => {
			result.current.handleAddPrice();
		});
		expect(result.current.prices).toHaveLength(1);
		expect((result.current.prices as any)[0]).toEqual(
			expect.objectContaining({
				value: 'USD',
				isDefault: true,
				valueAmount: 10
			})
		);

		// add EUR non-default
		act(() => {
			result.current.setAmount('20');
			result.current.setCurrency('EUR');
			result.current.setIsDefault(false);
		});
		act(() => {
			result.current.handleAddPrice();
		});
		expect(result.current.prices).toHaveLength(2);
		const prices = result.current.prices as any[];
		const usd = prices.find(p => p.value === 'USD');
		const eur = prices.find(p => p.value === 'EUR');
		expect(usd.isDefault).toBe(true);
		expect(eur.isDefault).toBe(false);

		// make EUR default (should flip default to EUR only)
		act(() => {
			result.current.setAmount('30');
			result.current.setCurrency('EUR');
			result.current.setIsDefault(true);
		});
		act(() => {
			result.current.handleAddPrice();
		});
		const prices2 = result.current.prices as any[];
		expect(prices2.find(p => p.value === 'EUR')!.isDefault).toBe(true);
		expect(prices2.find(p => p.value === 'USD')!.isDefault).toBe(false);

		// invalid amount
		const before = (result.current.prices as any[]).length;
		act(() => {
			result.current.setAmount('-5');
			result.current.setCurrency('GBP');
		});
		act(() => {
			result.current.handleAddPrice();
		});
		expect((result.current.prices as any[]).length).toBe(before);
	});

	it('handlePricesChange normalizes to a single default', () => {
		const { result } = renderHook(() => usePriceActions());
		const payload: any[] = [
			{ value: 'USD', label: '10 USD', valueAmount: 10, isDefault: true },
			{ value: 'EUR', label: '20 EUR', valueAmount: 20, isDefault: true }
		];

		act(() => {
			result.current.handlePricesChange(payload as any);
		});

		const prices = result.current.prices as any[];
		const defaults = prices.filter(p => p.isDefault);
		expect(defaults).toHaveLength(1);
		expect(['USD', 'EUR']).toContain(defaults[0].value);
	});
});
