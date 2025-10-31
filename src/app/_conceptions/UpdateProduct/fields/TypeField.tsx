import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

const TYPE_OPTIONS: SelectOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'laptop', label: 'Laptop' },
	{ value: 'monitor', label: 'Monitor' }
];

export const TypeField = () => {
	const { register, setValue, watch } = useFormContext();
	const t = useTranslations('App');
	const value = watch('type');

	const toSelectValue = (options: SelectOption[], value?: string | number) => {
		if (value === undefined || value === '') return '';
		const match = options.find(o => String(o.value) === String(value));
		return match ? match.value : '';
	};

	return (
		<Form.Group className='mb-3' controlId='type'>
			<Form.Label>{t('Type')}</Form.Label>
			<SelectField
				options={TYPE_OPTIONS}
				value={toSelectValue(TYPE_OPTIONS, value)}
				onChange={e => setValue('type', e.target.value)}
				placeholder={t('Select type')}
			/>
			<input type='hidden' {...register('type')} />
		</Form.Group>
	);
};
