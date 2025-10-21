'use client';

import { memo } from 'react';
import { Form } from 'react-bootstrap';

import { MultiSelectField } from '@/components/ui/MultiSelectField';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField/types';
import { TextField } from '@/components/ui/TextField';

import { usePriceActions } from '../../hooks/addProduct/usePriceActions';
import { Button } from '../ui/Button';

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

	const selectOptions: SelectOption[] = currencyOptions.map(o => ({
		value: o.value,
		label: o.label
	}));

	return (
		<>
			<div className='d-flex flex-column'>
				<Form.Group className='mb-3' controlId='priceAmount'>
					<Form.Label>Amount</Form.Label>
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
					<Form.Label>Currency</Form.Label>
					<SelectField
						options={selectOptions}
						value={currency}
						onChange={e => setCurrency(e.target.value)}
						placeholder='Select currency'
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='priceDefault'>
					<Form.Check
						type='checkbox'
						label='Default'
						checked={isDefault}
						onChange={e => setIsDefault(e.target.checked)}
					/>
				</Form.Group>
				<div className='ms-auto'>
					<Button type='button' onClick={handleAddPrice} text='Add Price' />
				</div>
			</div>

			<Form.Group className='mb-3' controlId='prices'>
				<Form.Label>Prices</Form.Label>
				<MultiSelectField
					instanceId='product-prices'
					options={prices as any}
					value={prices}
					onChange={handlePricesChange}
					placeholder='Select currencies'
				/>
			</Form.Group>
		</>
	);
});
