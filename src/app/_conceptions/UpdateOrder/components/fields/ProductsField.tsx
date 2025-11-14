import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { MultiValue } from 'react-select';

import { OptionType } from '@/components/MultiSelectField/types';

const MultiSelectField = dynamic(
	() =>
		import('@/components/MultiSelectField').then(mod => mod.MultiSelectField),
	{ ssr: false }
);

export const ProductsField = () => {
	const { watch, setValue } = useFormContext();
	const productOptions = watch('productOptions');
	const selected = watch('productsSelected');
	const t = useTranslations('App');
	const onProductsChange = (val: MultiValue<OptionType>) => {
		setValue('productsSelected', val);
	};

	return (
		<Form.Group className='mb-4' controlId='products'>
			<Form.Label>{t('Products')}</Form.Label>
			<MultiSelectField
				options={productOptions}
				value={selected}
				onChange={onProductsChange}
				closeMenuOnSelect={false}
				placeholder={t('Select')}
			/>
		</Form.Group>
	);
};
