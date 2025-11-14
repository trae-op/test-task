import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

import type { TOptionItem, TUpdateFormExtended } from '../../types';

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

export const TypeField = () => {
	const { register, setValue, watch } = useFormContext<TUpdateFormExtended>();
	const t = useTranslations('App');
	const value = watch('type');
	const productType = watch('productType') as TOptionItem[] | undefined;

	const typeOptions: SelectOption[] = useMemo(
		() => (productType ?? []).map(pt => ({ value: pt.value, label: pt.title })),
		[productType]
	);

	return (
		<Form.Group className='mb-3' controlId='type'>
			<Form.Label>{t('Type')}</Form.Label>
			<SelectField
				options={typeOptions}
				value={toSelectValue(typeOptions, value)}
				onChange={e => setValue('type', e.target.value)}
				placeholder={t('Select type')}
			/>
			<input type='hidden' {...register('type')} />
		</Form.Group>
	);
};
