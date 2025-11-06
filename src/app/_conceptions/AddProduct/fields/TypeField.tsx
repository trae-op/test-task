'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext, useWatch } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

import type { TAddProductFormData } from '@/hooks/addProduct/types';

type TOptionItem = { id: string; value: string; title: string };
type TAddProductFormExtended = TAddProductFormData & {
	productType?: TOptionItem[];
};

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

export const TypeField = () => {
	const t = useTranslations('App');
	const { register, setValue, control, watch } =
		useFormContext<TAddProductFormExtended>();
	const watchType = useWatch({ control, name: 'type' });
	const productType = watch('productType');

	const typeOptions: SelectOption[] = useMemo(
		() => (productType ?? []).map(pt => ({ value: pt.value, label: pt.title })),
		[productType]
	);

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
