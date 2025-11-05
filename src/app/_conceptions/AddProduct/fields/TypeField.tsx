'use client';

import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext, useWatch } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

import type { TAddProductFormData } from '@/hooks/addProduct/types';

import type { TTypeFieldProps } from './types';

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

export const TypeField = ({ typeOptions }: TTypeFieldProps) => {
	const t = useTranslations('App');
	const { register, setValue, control } = useFormContext<TAddProductFormData>();
	const watchType = useWatch({ control, name: 'type' });

	return (
		<Form.Group className='mb-3' controlId='type'>
			<Form.Label>{t('Type')}</Form.Label>
			<SelectField
				options={typeOptions}
				value={toSelectValue(typeOptions, watchType)}
				onChange={e => setValue('type', e.target.value)}
				placeholder={t('Select type')}
			/>
			<input type='hidden' {...register('type')} />
		</Form.Group>
	);
};
