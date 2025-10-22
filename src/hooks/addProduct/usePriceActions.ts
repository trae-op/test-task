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

		const newOption: any = {
			value: currency,
			label: `${amountNum} ${currency}`,
			valueAmount: amountNum,
			isDefault
		};

		const next = (prev => {
			let n = prev.filter((p: any) => p.value !== currency);
			n = [...n, newOption];
			if (isDefault) {
				n = n.map((p: any) => ({ ...p, isDefault: p.value === currency }));
			}
			return n as MultiValue<OptionType>;
		})(prices);

		pushChange(next);

		setAmount('');
		setIsDefault(false);
	}, [amount, currency, isDefault, prices, pushChange]);

	const handlePricesChange = useCallback(
		(val: MultiValue<OptionType>) => {
			// ensure at most one default remains if user removes/selects
			const defaultItems = (val as any[]).filter(v => v.isDefault);
			let normalized = val as any[];
			if (defaultItems.length > 1) {
				const keep = defaultItems[0]?.value;
				normalized = (val as any[]).map(v => ({
					...v,
					isDefault: v.value === keep
				}));
			}
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
