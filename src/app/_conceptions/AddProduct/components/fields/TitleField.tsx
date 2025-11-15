'use client';

import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TAddProductFormData } from '../../hooks/types';

export const TitleField = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const {
		register,
		formState: { errors }
	} = useFormContext<TAddProductFormData>();

	return (
		<Form.Group className='mb-3' controlId='title'>
			<Form.Label>{t('Title')}</Form.Label>
			<TextField
				{...register('title', { required: t('This field is required') })}
				type='text'
				placeholder={t('Enter title')}
				isInvalid={!!errors.title}
				errorMessage={errors.title?.message}
			/>
		</Form.Group>
	);
};
