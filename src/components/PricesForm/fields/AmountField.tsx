import { memo } from 'react';
import { Form } from 'react-bootstrap';

import { TextField } from '@/components/TextField';

type TAmountFieldProps = {
	value: string;
	onChange: (value: string) => void;
	label: string;
};

export const AmountField = memo(
	({ value, onChange, label }: TAmountFieldProps) => (
		<Form.Group className='mb-3' controlId='priceAmount'>
			<Form.Label>{label}</Form.Label>
			<TextField
				type='number'
				min='0'
				step='0.01'
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder='0.00'
			/>
		</Form.Group>
	)
);
