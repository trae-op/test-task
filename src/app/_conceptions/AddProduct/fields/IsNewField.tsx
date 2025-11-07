import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

export const IsNewField = () => {
	const { control } = useFormContext();
	const t = useTranslations('App');

	return (
		<Form.Group className='mb-3' controlId='isNew'>
			<Controller
				name='isNew'
				control={control}
				render={({ field }) => (
					<Form.Check
						type='checkbox'
						label={t('Available')}
						checked={!!field.value}
						onChange={e => field.onChange(e.target.checked)}
						ref={field.ref}
					/>
				)}
			/>
		</Form.Group>
	);
};
