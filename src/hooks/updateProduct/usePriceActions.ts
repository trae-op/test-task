import { useCallback, useMemo, useState } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TPriceActionsParams } from './types';

export const usePriceActions = ({ onChange }: TPriceActionsParams = {}) => {
	const [amount, setAmount] = useState<string>('');
	const [currency, setCurrency] = useState<string>('');
	const [isDefault, setIsDefault] = useState<boolean>(false);
	const [prices, setPrices] = useState<MultiValue<OptionType>>([]);

	const pushChange = useCallback(
		(val: MultiValue<OptionType>) => {
			setPrices(val);
			onChange?.(val);
		},
		[onChange]
	);

	const handleAddPrice = useCallback(() => {
		const amountNum = Number(amount);
		if (!currency) return;
		if (Number.isNaN(amountNum) || amountNum <= 0) return;

		const newOption: OptionType = {
			value: currency,
			label: `${amountNum} ${currency}`,
			valueAmount: amountNum,
			isDefault
		};

		const next = (prev => {
			let n = prev.filter(p => p.value !== currency);
			n = [...n, newOption];
			if (isDefault) {
				n = n.map(p => ({ ...p, isDefault: p.value === currency }));
			}
			return n as MultiValue<OptionType>;
		})(prices);

		pushChange(next);

		setAmount('');
		setIsDefault(false);
	}, [amount, currency, isDefault, prices, pushChange]);

	const handlePricesChange = useCallback(
		(val: MultiValue<OptionType>) => {
			const defaultItems = (val as OptionType[]).filter(v => v.isDefault);
			let normalized = val as OptionType[];
			if (defaultItems.length > 1) {
				const keep = defaultItems[0]?.value;
				normalized = (val as OptionType[]).map(v => ({
					...v,
					isDefault: v.value === keep
				}));
			}
			pushChange(normalized as MultiValue<OptionType>);
		},
		[pushChange]
	);

	const result = useMemo(
		() => ({
			amount,
			currency,
			isDefault,
			prices,
			setPrices,
			setAmount,
			setCurrency,
			setIsDefault,
			handleAddPrice,
			handlePricesChange
		}),
		[
			amount,
			currency,
			isDefault,
			prices,
			setPrices,
			setAmount,
			setCurrency,
			setIsDefault,
			handleAddPrice,
			handlePricesChange
		]
	);

	return result;
};
