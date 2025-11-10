import { useCallback, useState } from 'react';
import type { MultiValue } from 'react-select';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TUsePriceActionsArgs } from './types';

export const usePriceActions = ({ onChange }: TUsePriceActionsArgs = {}) => {
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
			const entries = val as OptionType[];
			const defaults = entries.filter(entry => entry.isDefault);
			if (defaults.length <= 1) {
				pushChange(val);
				return;
			}
			const [{ value: keepDefault }] = defaults;
			const normalized = entries.map(entry => ({
				...entry,
				isDefault: entry.value === keepDefault
			}));
			pushChange(normalized as MultiValue<OptionType>);
		},
		[pushChange]
	);

	return {
		amount,
		currency,
		isDefault,
		prices,
		setAmount,
		setCurrency,
		setIsDefault,
		handleAddPrice,
		handlePricesChange
	};
};
