import { memo } from 'react';
import { Form } from 'react-bootstrap';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

type TCurrencyFieldProps = {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	disabledOptions: SelectOption[];
	label: string;
	placeholder: string;
};

export const CurrencyField = memo(
	({
		value,
		onChange,
		options,
		disabledOptions,
		label,
		placeholder
	}: TCurrencyFieldProps) => (
		<Form.Group className='mb-3' controlId='priceCurrency'>
			<Form.Label>{label}</Form.Label>
			<SelectField
				options={options}
				value={value}
				disabledOptions={disabledOptions}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
			/>
		</Form.Group>
	)
);
