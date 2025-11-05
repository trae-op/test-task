'use client';

import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TAddProductFormData } from '@/hooks/addProduct/types';

export const GuaranteeStartField = () => {
	const t = useTranslations('App');
	const { register } = useFormContext<TAddProductFormData>();

	return (
		<Form.Group className='mb-3' controlId='guaranteeStart'>
			<Form.Label>{t('Guarantee start')}</Form.Label>
			<TextField {...register('guaranteeStart')} type='date' />
		</Form.Group>
	);
};
