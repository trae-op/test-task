import { act, renderHook } from '@testing-library/react';

import { usePriceActions } from '@/hooks/updateProduct/usePriceActions';

describe('updateProduct/usePriceActions', () => {
	it('adds prices and enforces single default', () => {
		const { result } = renderHook(() => usePriceActions());

		act(() => {
			result.current.setAmount('15');
			result.current.setCurrency('USD');
			result.current.setIsDefault(true);
			result.current.handleAddPrice();
		});

		act(() => {
			result.current.setAmount('25');
			result.current.setCurrency('EUR');
			result.current.setIsDefault(true);
			result.current.handleAddPrice();
		});

		const prices = result.current.prices as any[];
		const defaults = prices.filter(p => p.isDefault);
		expect(defaults).toHaveLength(1);
	});
});
