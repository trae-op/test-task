import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MultiValue } from 'react-select';

import { OptionType } from '@/components/MultiSelectField/types';

import type { TPriceOption } from './types';

export const usePriceFormActions = () => {
	const { setValue, watch } = useFormContext();
	const [amount, setAmount] = useState<string>('');
	const [currency, setCurrency] = useState<string>('');
	const [isDefault, setIsDefault] = useState<boolean>(false);
	const watchedPrices = watch('prices');
	const prices = useMemo(() => watchedPrices || [], [watchedPrices]);

	const updatePrices = useCallback(
		(val: MultiValue<OptionType>) => {
			setValue('prices', val);
		},
		[setValue]
	);

	const createPriceOption = useCallback(
		(
			amountNum: number,
			currencyValue: string,
			isDefaultValue: boolean
		): TPriceOption => ({
			value: currencyValue,
			label: `${isDefaultValue ? 'Default' : ''} ${amountNum} ${currencyValue}`,
			valueAmount: amountNum,
			isDefault: isDefaultValue
		}),
		[]
	);

	const normalizePrices = useCallback(
		(
			priceList: TPriceOption[],
			newCurrency: string,
			shouldBeDefault: boolean
		) => {
			const filteredPrices = priceList.filter(
				(p: TPriceOption) => p.value !== newCurrency
			);
			const updatedPrices = shouldBeDefault
				? filteredPrices.map((p: TPriceOption) => ({ ...p, isDefault: false }))
				: filteredPrices;

			return updatedPrices;
		},
		[]
	);

	const handleAddPrice = useCallback(() => {
		const amountNum = Number(amount);

		if (!currency || Number.isNaN(amountNum) || amountNum <= 0) return;

		const newOption = createPriceOption(amountNum, currency, isDefault);
		const normalizedPrices = normalizePrices(prices, currency, isDefault);
		const updatedPrices = [...normalizedPrices, newOption];

		updatePrices(updatedPrices as MultiValue<OptionType>);

		setAmount('');
		setIsDefault(false);
	}, [
		amount,
		currency,
		isDefault,
		prices,
		createPriceOption,
		normalizePrices,
		updatePrices
	]);

	const handlePricesChange = useCallback(
		(val: MultiValue<OptionType>) => {
			const defaultItems = (val as TPriceOption[]).filter(v => v.isDefault);

			if (defaultItems.length <= 1) {
				updatePrices(val);
				return;
			}

			const firstDefaultValue = defaultItems[0]?.value;
			const normalized = (val as TPriceOption[]).map(v => ({
				...v,
				isDefault: v.value === firstDefaultValue
			}));

			updatePrices(normalized as MultiValue<OptionType>);
		},
		[updatePrices]
	);

	return useMemo(
		() => ({
			amount,
			currency,
			isDefault,
			prices,
			setAmount,
			setCurrency,
			setIsDefault,
			handleAddPrice,
			handlePricesChange
		}),
		[amount, currency, isDefault, prices, handleAddPrice, handlePricesChange]
	);
};
