import { act, renderHook } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import { usePriceFormActions } from '@/hooks/pricesForm';
import type { TPriceOption } from '@/hooks/pricesForm/types';

type TFormValues = {
	prices: MultiValue<OptionType> | undefined;
};

const createWrapper = (initialPrices?: TPriceOption[]) => {
	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		const methods = useForm<TFormValues>({
			defaultValues: {
				prices: initialPrices as MultiValue<OptionType> | undefined
			}
		});

		return <FormProvider {...methods}>{children}</FormProvider>;
	};

	return Wrapper;
};

describe('usePriceFormActions', () => {
	test('returns initial state and updates prices through handleAddPrice', () => {
		const { result } = renderHook(() => usePriceFormActions(), {
			wrapper: createWrapper()
		});

		expect(result.current.amount).toBe('');
		expect(result.current.currency).toBe('');
		expect(result.current.isDefault).toBe(false);
		expect(result.current.prices).toEqual([]);

		act(() => {
			result.current.setAmount('10');
			result.current.setCurrency('USD');
			result.current.setIsDefault(true);
		});

		act(() => {
			result.current.handleAddPrice();
		});

		expect(result.current.prices).toHaveLength(1);
		const price = result.current.prices[0] as TPriceOption;
		expect(price.value).toBe('USD');
		expect(price.valueAmount).toBe(10);
		expect(price.isDefault).toBe(true);
		expect(result.current.amount).toBe('');
		expect(result.current.isDefault).toBe(false);
	});

	test('handleAddPrice ignores invalid values', () => {
		const { result } = renderHook(() => usePriceFormActions(), {
			wrapper: createWrapper()
		});

		act(() => {
			result.current.setAmount('0');
			result.current.setCurrency('USD');
			result.current.handleAddPrice();
		});

		expect(result.current.prices).toEqual([]);

		act(() => {
			result.current.setAmount('abc');
			result.current.setCurrency('USD');
			result.current.handleAddPrice();
		});

		expect(result.current.prices).toEqual([]);

		act(() => {
			result.current.setAmount('10');
			result.current.setCurrency('');
			result.current.handleAddPrice();
		});

		expect(result.current.prices).toEqual([]);
	});

	test('handleAddPrice normalizes existing prices and keeps only one per currency', () => {
		const existingPrices: TPriceOption[] = [
			{
				value: 'USD',
				label: '10 USD',
				valueAmount: 10,
				isDefault: false
			},
			{
				value: 'EUR',
				label: '5 EUR',
				valueAmount: 5,
				isDefault: true
			}
		];

		const { result } = renderHook(() => usePriceFormActions(), {
			wrapper: createWrapper(existingPrices)
		});

		act(() => {
			result.current.setAmount('20');
			result.current.setCurrency('USD');
			result.current.setIsDefault(true);
		});

		act(() => {
			result.current.handleAddPrice();
		});

		expect(result.current.prices).toHaveLength(2);
		const prices = result.current.prices as TPriceOption[];
		const usd = prices.find(p => p.value === 'USD');
		const eur = prices.find(p => p.value === 'EUR');

		expect(usd?.valueAmount).toBe(20);
		expect(usd?.isDefault).toBe(true);
		expect(eur?.isDefault).toBe(false);
	});

	test('handlePricesChange enforces single default price', () => {
		const initial: TPriceOption[] = [
			{
				value: 'USD',
				label: '10 USD',
				valueAmount: 10,
				isDefault: true
			},
			{
				value: 'EUR',
				label: '5 EUR',
				valueAmount: 5,
				isDefault: false
			}
		];

		const { result } = renderHook(() => usePriceFormActions(), {
			wrapper: createWrapper(initial)
		});

		act(() => {
			result.current.handlePricesChange([
				{ ...initial[0], isDefault: true },
				{ ...initial[1], isDefault: true }
			] as unknown as MultiValue<OptionType>);
		});

		const prices = result.current.prices as TPriceOption[];
		const defaultPrices = prices.filter(p => p.isDefault);
		expect(defaultPrices).toHaveLength(1);
		expect(defaultPrices[0]?.value).toBe('USD');
	});

	test('handlePricesChange keeps value when there is at most one default', () => {
		const initial: TPriceOption[] = [
			{
				value: 'USD',
				label: '10 USD',
				valueAmount: 10,
				isDefault: true
			},
			{
				value: 'EUR',
				label: '5 EUR',
				valueAmount: 5,
				isDefault: false
			}
		];

		const { result } = renderHook(() => usePriceFormActions(), {
			wrapper: createWrapper(initial)
		});

		const newValue: TPriceOption[] = [
			{ ...initial[0], isDefault: true },
			{ ...initial[1], isDefault: false }
		];

		act(() => {
			result.current.handlePricesChange(
				newValue as unknown as MultiValue<OptionType>
			);
		});

		expect(result.current.prices).toEqual(newValue);
	});
});
