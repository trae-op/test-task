import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';

export const TypeField = ({ typeOptions }: { typeOptions: SelectOption[] }) => {
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
				options={typeOptions}
				value={toSelectValue(typeOptions, value)}
				onChange={e => setValue('type', e.target.value)}
				placeholder={t('Select type')}
			/>
			<input type='hidden' {...register('type')} />
		</Form.Group>
	);
};
