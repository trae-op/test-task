import { memo, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

type TCurrencyFieldProps = {
	value: string;
	onChange: (value: string) => void;
	disabledOptions: SelectOption[];
	label: string;
	placeholder: string;
};

export const CurrencyField = memo(
	({
		value,
		onChange,
		disabledOptions,
		label,
		placeholder
	}: TCurrencyFieldProps) => {
		const { watch } = useFormContext();
		const currencies = watch('currency') as
			| { value: string; title: string }[]
			| undefined;

		const selectOptions = useMemo(
			() =>
				(currencies ?? []).map(currency => ({
					value: currency.value,
					label: currency.title
				})),
			[currencies]
		);

		return (
			<Form.Group className='mb-3' controlId='priceCurrency'>
				<Form.Label>{label}</Form.Label>
				<SelectField
					options={selectOptions}
					value={value}
					disabledOptions={disabledOptions}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			</Form.Group>
		);
	}
);
