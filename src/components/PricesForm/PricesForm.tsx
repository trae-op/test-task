'use client';

import { useTranslations } from 'next-intl';
import { memo, useMemo } from 'react';

import { TPriceOption } from '@/hooks/pricesForm/types';
import { usePriceFormActions } from '@/hooks/pricesForm/usePriceFormActions';

import { AddButton } from './fields/AddButton';
import { AmountField } from './fields/AmountField';
import { CurrencyField } from './fields/CurrencyField';
import { DefaultCheckbox } from './fields/DefaultCheckbox';
import { ListField } from './fields/ListField';

const currencyOptions = [
	{ value: 'USD', label: 'USD' },
	{ value: 'UAH', label: 'UAH' }
];

export const PricesForm = memo(() => {
	const t = useTranslations('App');

	const {
		amount,
		currency,
		isDefault,
		prices,
		setAmount,
		setCurrency,
		setIsDefault,
		handleAddPrice,
		handlePricesChange
	} = usePriceFormActions();

	const selectOptions = useMemo(
		() =>
			currencyOptions.map(o => ({
				value: o.value,
				label: o.label
			})),
		[currencyOptions]
	);

	const disabledOptions = useMemo(
		() =>
			prices
				.filter((p: TPriceOption) => p.value !== '')
				.map((p: TPriceOption) => ({
					value: p.value,
					label: p.label
				})),
		[prices]
	);

	const hasDefaultPrice = useMemo(
		() => prices.some((p: TPriceOption) => p.isDefault),
		[prices]
	);

	const handleAmountChange = (value: string) => {
		setAmount(value);
	};

	const handleCurrencyChange = (value: string) => {
		setCurrency(value);
	};

	const handleDefaultChange = (checked: boolean) => {
		setIsDefault(checked);
	};

	return (
		<>
			<div className='d-flex flex-column'>
				<AmountField
					value={amount}
					onChange={handleAmountChange}
					label={t('Amount')}
				/>

				<CurrencyField
					value={currency}
					onChange={handleCurrencyChange}
					options={selectOptions}
					disabledOptions={disabledOptions}
					label={t('Currency')}
					placeholder={t('Select currency')}
				/>

				<DefaultCheckbox
					checked={isDefault}
					disabled={hasDefaultPrice}
					onChange={handleDefaultChange}
					label={t('Default')}
				/>

				<AddButton onClick={handleAddPrice} text={t('Add price')} />
			</div>

			<ListField
				prices={prices}
				onChange={handlePricesChange}
				label={t('Prices')}
				placeholder={t('Select prices')}
			/>
		</>
	);
});
