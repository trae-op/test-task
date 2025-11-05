'use client';

import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TAddProductFormData } from '@/hooks/addProduct/types';

export const GuaranteeEndField = () => {
	const t = useTranslations('App');
	const {
		register,
		formState: { errors },
		watch
	} = useFormContext<TAddProductFormData>();
	const watchGuaranteeStart = watch('guaranteeStart');

	return (
		<Form.Group className='mb-3' controlId='guaranteeEnd'>
			<Form.Label>{t('Guarantee end')}</Form.Label>
			<TextField
				{...register('guaranteeEnd', {
					validate: value => {
						if (!value || !watchGuaranteeStart) return true;
						return (
							new Date(value) >= new Date(watchGuaranteeStart) ||
							'End date must be after start date'
						);
					}
				})}
				type='date'
				isInvalid={!!errors.guaranteeEnd}
				errorMessage={errors.guaranteeEnd?.message}
			/>
		</Form.Group>
	);
};
