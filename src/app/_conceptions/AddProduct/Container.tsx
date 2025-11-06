'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { AddProduct } from './AddProduct';
import { TAddProductFormExtended, TContainerProps } from './types';

export const Container = ({ productType, currency }: TContainerProps) => {
	const methods = useForm<TAddProductFormExtended>({
		mode: 'onBlur',
		defaultValues: { productType, currency }
	});

	return (
		<FormProvider {...methods}>
			<AddProduct />
		</FormProvider>
	);
};
