import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/TextField';

export const SpecificationField = () => {
	const { register } = useFormContext();
	const t = useTranslations('App');

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
