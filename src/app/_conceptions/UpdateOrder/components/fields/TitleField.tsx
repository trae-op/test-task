import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

import type { TUpdateOrderFormData } from '@/app/_conceptions/UpdateOrder/hooks/types';

export const TitleField = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const {
		register,
		formState: { errors }
	} = useFormContext<TUpdateOrderFormData>();

	return (
		<Form.Group
			className='mb-3'
			controlId='title'
			data-testid='update-order-title-field'
		>
			<Form.Label>{t('Title')}</Form.Label>
			<TextField
				{...register('title', { required: t('This field is required') })}
				type='text'
				placeholder={t('Enter title')}
				isInvalid={!!errors.title}
				aria-invalid={errors.title ? 'true' : undefined}
				errorMessage={
					typeof errors.title?.message === 'string'
						? errors.title.message
						: undefined
				}
				data-testid='update-order-title-input'
			/>
		</Form.Group>
	);
};
