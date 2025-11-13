import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

export const TitleField = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const {
		register,
		formState: { errors }
	} = useFormContext<TUpdateOrderFormData>();

	return (
		<Form.Group className='mb-3' controlId='title'>
			<Form.Label>{t('Title')}</Form.Label>
			<TextField
				{...register('title', { required: t('This field is required') })}
				type='text'
				placeholder={t('Enter title')}
				isInvalid={!!errors.title}
				errorMessage={
					typeof errors.title?.message === 'string'
						? errors.title.message
						: undefined
				}
			/>
		</Form.Group>
	);
};
