'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { TAddProductFormExtended, TContainerProps } from '../types';

import { AddProduct } from './AddProduct';

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
