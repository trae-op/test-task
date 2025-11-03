import { act, renderHook } from '@testing-library/react';

import { usePriceFormActions } from '@/hooks/pricesForm/usePriceFormActions';

const setValue = jest.fn();
let watched: any[] = [];
jest.mock('react-hook-form', () => ({
	useFormContext: () => ({
		setValue,
		watch: (key: string) => (key === 'prices' ? watched : undefined)
	})
}));

describe('pricesForm/usePriceFormActions', () => {
	beforeEach(() => {
		setValue.mockReset();
		watched = [];
	});

	it('validates input, adds price, and normalizes defaults', () => {
		const { result } = renderHook(() => usePriceFormActions());

		// invalid
		act(() => {
			result.current.setAmount('');
			result.current.setCurrency('');
			result.current.setIsDefault(true);
			result.current.handleAddPrice();
		});
		expect(setValue).not.toHaveBeenCalled();

		// add USD default
		act(() => {
			result.current.setAmount('10');
			result.current.setCurrency('USD');
			result.current.setIsDefault(true);
		});
		act(() => {
			result.current.handleAddPrice();
		});
		expect(setValue).toHaveBeenCalledTimes(1);
		let payload = setValue.mock.calls[0][1];
		expect(payload).toHaveLength(1);
		expect(payload[0]).toEqual(
			expect.objectContaining({ value: 'USD', isDefault: true })
		);

		// reflect back the set prices for next calls
		watched = payload;

		// add EUR non-default
		act(() => {
			result.current.setAmount('20');
			result.current.setCurrency('EUR');
			result.current.setIsDefault(false);
		});
		act(() => {
			result.current.handleAddPrice();
		});
		payload = setValue.mock.calls[1][1];
		const usd = payload.find((p: any) => p.value === 'USD');
		const eur = payload.find((p: any) => p.value === 'EUR');
		expect(usd.isDefault).toBe(true);
		expect(eur.isDefault).toBe(false);

		// handlePricesChange with two defaults -> only one remains
		act(() => {
			result.current.handlePricesChange([
				{ value: 'USD', label: '10 USD', valueAmount: 10, isDefault: true },
				{ value: 'EUR', label: '20 EUR', valueAmount: 20, isDefault: true }
			] as any);
		});
		payload = setValue.mock.calls[2][1];
		expect(payload.filter((p: any) => p.isDefault)).toHaveLength(1);
	});
});
