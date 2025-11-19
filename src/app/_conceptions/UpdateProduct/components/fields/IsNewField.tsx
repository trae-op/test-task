import { useTranslations } from 'next-intl';
import { Form } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

export const IsNewField = () => {
	const { control } = useFormContext();
	const t = useTranslations('App');

	return (
		<Form.Group
			className='mb-3'
			controlId='isNew'
			data-testid='update-product-is-new-field'
		>
			<Controller
				name='isNew'
				control={control}
				defaultValue={true}
				render={({ field }) => {
					const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
						field.onChange(event.target.checked);
					};

					return (
						<Form.Check
							type='checkbox'
							label={t('Available')}
							checked={!!field.value}
							onChange={onChange}
							ref={field.ref}
							data-testid='update-product-is-new-input'
						/>
					);
				}}
			/>
		</Form.Group>
	);
};
