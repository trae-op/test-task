import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Form } from 'react-bootstrap';
import { MultiValue } from 'react-select';

import { Loading } from '@/components/Loading';
import { OptionType } from '@/components/MultiSelectField/types';

import { TPriceOption } from '@/hooks/pricesForm/types';

const MultiSelectField = dynamic(
	() => import('@/components/MultiSelectField').then(m => m.MultiSelectField),
	{
		ssr: false,
		loading: () => <Loading />
	}
);

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
