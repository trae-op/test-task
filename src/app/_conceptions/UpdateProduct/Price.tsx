'use client';

import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MultiSelectField } from '@/components/MultiSelectField';
import { OptionType } from '@/components/MultiSelectField/types';
import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';
import { TextField } from '@/components/TextField';

import { usePriceActions } from '@/hooks/updateProduct/usePriceActions';

import type { TPriceOption, TPriceProps } from './types';

export const Price = memo(
	({ currencyOptions, onChange, prices: defaultPrices }: TPriceProps) => {
		const [amount, setAmount] = useState<string>('');
		const [currency, setCurrency] = useState<string>('');
		const [isDefault, setIsDefault] = useState<boolean>(false);
		const [prices, setPrices] = useState<MultiValue<TPriceOption>>(
			defaultPrices || []
		);

		const pushChange = useCallback(
			(val: MultiValue<TPriceOption>) => {
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
				label: `${isDefault ? 'Default' : ''} ${amountNum} ${currency}`,
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

		const t = useTranslations('App');

		const selectOptions: SelectOption[] = currencyOptions.map(o => ({
			value: o.value,
			label: o.label
		}));

		return (
			<>
				<div className='d-flex flex-column'>
					<Form.Group className='mb-3' controlId='priceAmount'>
						<Form.Label>{t('Amount')}</Form.Label>
						<TextField
							type='number'
							min='0'
							step='0.01'
							value={amount}
							onChange={e => setAmount(e.target.value)}
							placeholder='0.00'
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='priceCurrency'>
						<Form.Label>{t('Currency')}</Form.Label>
						<SelectField
							options={selectOptions}
							value={currency}
							disabledOptions={prices
								.filter(p => p.value !== '')
								.map(p => ({
									value: p.value,
									label: p.label
								}))}
							onChange={e => setCurrency(e.target.value)}
							placeholder={t('Select currency')}
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='priceDefault'>
						<Form.Check
							type='checkbox'
							label={t('Default')}
							checked={isDefault}
							disabled={prices.some(p => p.isDefault)}
							onChange={e => setIsDefault(e.target.checked)}
						/>
					</Form.Group>
					<div className='ms-auto'>
						<Button
							type='button'
							onClick={handleAddPrice}
							text={t('Add price')}
						/>
					</div>
				</div>

				<Form.Group className='mb-3' controlId='prices'>
					<Form.Label>{t('Prices')}</Form.Label>
					<MultiSelectField
						instanceId='product-prices'
						options={prices as any}
						value={prices}
						onChange={handlePricesChange}
						placeholder={t('Select prices')}
					/>
				</Form.Group>
			</>
		);
	}
);
