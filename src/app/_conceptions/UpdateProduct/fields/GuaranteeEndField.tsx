import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

export const GuaranteeEndField = () => {
	const {
		control,
		watch,
		formState: { errors }
	} = useFormContext();
	const t = useTranslations('App');
	const watchGuaranteeStart = watch('guaranteeStart');

	return (
		<Form.Group className='mb-3' controlId='guaranteeEnd'>
			<Form.Label>{t('Guarantee end')}</Form.Label>
			<Controller
				name='guaranteeEnd'
				control={control}
				rules={{
					validate: (value: string) => {
						if (!value || !watchGuaranteeStart) return true;
						return (
							new Date(value) >= new Date(watchGuaranteeStart) ||
							'End date must be after start date'
						);
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						type='date'
						isInvalid={!!errors.guaranteeEnd}
						errorMessage={
							typeof errors.guaranteeEnd?.message === 'string'
								? errors.guaranteeEnd.message
								: undefined
						}
					/>
				)}
			/>
		</Form.Group>
	);
};
