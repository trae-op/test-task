'use client';

import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TAddProductFormData } from '../../hooks/types';

export const SpecificationField = () => {
	const t = useTranslations('App');
	const { register } = useFormContext<TAddProductFormData>();

	return (
		<Form.Group className='mb-3' controlId='specification'>
			<Form.Label>{t('Specification')}</Form.Label>
			<TextField
				{...register('specification')}
				as='textarea'
				placeholder={t('Enter specification')}
			/>
		</Form.Group>
	);
};
