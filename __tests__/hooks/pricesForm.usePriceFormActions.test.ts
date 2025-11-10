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

		const applyAddPrice = (
			amount: string,
			currency: string,
			isDefault: boolean
		) => {
			act(() => {
				result.current.setAmount(amount);
				result.current.setCurrency(currency);
				result.current.setIsDefault(isDefault);
			});
			act(() => {
				result.current.handleAddPrice();
			});
		};

		act(() => {
			result.current.setAmount('');
			result.current.setCurrency('');
			result.current.setIsDefault(true);
			result.current.handleAddPrice();
		});
		expect(setValue).not.toHaveBeenCalled();

		applyAddPrice('10', 'USD', true);
		expect(setValue).toHaveBeenCalledTimes(1);
		let payload = setValue.mock.calls[0][1];
		expect(payload).toHaveLength(1);
		expect(payload[0]).toEqual(
			expect.objectContaining({ value: 'USD', isDefault: true })
		);

		watched = payload;

		applyAddPrice('20', 'EUR', false);
		payload = setValue.mock.calls[1][1];
		const usd = payload.find((p: any) => p.value === 'USD');
		const eur = payload.find((p: any) => p.value === 'EUR');
		expect(usd.isDefault).toBe(true);
		expect(eur.isDefault).toBe(false);

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
