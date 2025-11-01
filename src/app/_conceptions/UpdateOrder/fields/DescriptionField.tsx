import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

export const DescriptionField = () => {
	const t = useTranslations('App');
	const { register } = useFormContext<TUpdateOrderFormData>();

	return (
		<Form.Group className='mb-3' controlId='description'>
			<Form.Label>{t('Description')}</Form.Label>
			<TextField
				{...register('description')}
				as='textarea'
				placeholder={t('Enter description')}
			/>
		</Form.Group>
	);
};
