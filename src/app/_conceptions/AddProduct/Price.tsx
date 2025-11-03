'use client';

import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Form } from 'react-bootstrap';

import { MultiSelectField } from '@/components/MultiSelectField';
import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';
import { TextField } from '@/components/TextField';

import { Button } from '../../../components/Button';
import { usePriceActions } from '../../../hooks/addProduct/usePriceActions';

import type { TPriceProps } from './types';

export const Price = memo(({ currencyOptions, onChange }: TPriceProps) => {
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
	} = usePriceActions({ onChange });
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
						onChange={e => setCurrency(e.target.value)}
						placeholder={t('Select currency')}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='priceDefault'>
					<Form.Check
						type='checkbox'
						label={t('Default')}
						checked={isDefault}
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
					options={
						prices as import('@/components/MultiSelectField/types').OptionType[]
					}
					value={prices}
					onChange={handlePricesChange}
					placeholder={t('Select prices')}
				/>
			</Form.Group>
		</>
	);
});
