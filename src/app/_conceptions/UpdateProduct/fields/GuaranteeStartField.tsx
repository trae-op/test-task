import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

export const GuaranteeStartField = () => {
	const {
		control,
		formState: { errors }
	} = useFormContext();
	const t = useTranslations('App');

	return (
		<Form.Group className='mb-3' controlId='guaranteeStart'>
			<Form.Label>{t('Guarantee start')}</Form.Label>
			<Controller
				name='guaranteeStart'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						type='date'
						isInvalid={!!errors.guaranteeStart}
						errorMessage={
							typeof errors.guaranteeStart?.message === 'string'
								? errors.guaranteeStart.message
								: undefined
						}
					/>
				)}
			/>
		</Form.Group>
	);
};
