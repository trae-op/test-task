import { memo } from 'react';
import { Form } from 'react-bootstrap';
import { MultiValue } from 'react-select';

import { MultiSelectField } from '@/components/MultiSelectField';
import { OptionType } from '@/components/MultiSelectField/types';

import { TPriceOption } from '@/hooks/pricesForm/types';

type TListFieldProps = {
	prices: TPriceOption[];
	onChange: (val: MultiValue<OptionType>) => void;
	label: string;
	placeholder: string;
};

export const ListField = memo(
	({ prices, onChange, label, placeholder }: TListFieldProps) => (
		<Form.Group className='mb-3' controlId='prices'>
			<Form.Label>{label}</Form.Label>
			<MultiSelectField
				instanceId='product-prices'
				options={prices as OptionType[]}
				value={prices}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</Form.Group>
	)
);
