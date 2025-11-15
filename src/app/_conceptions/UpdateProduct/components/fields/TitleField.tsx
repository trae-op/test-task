import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

export const TitleField = () => {
	const {
		register,
		formState: { errors }
	} = useFormContext();
	const t = useTranslations('App');
	const te = useTranslations('App.errors');

	return (
		<Form.Group
			className='mb-3'
			controlId='title'
			data-testid='update-product-title-field'
		>
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
				data-testid='update-product-title-input'
			/>
		</Form.Group>
	);
};
