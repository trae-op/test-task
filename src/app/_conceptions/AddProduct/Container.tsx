'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TAddProductFormData } from '@/hooks/addProduct/types';

import { AddProduct } from './AddProduct';

export const Container = () => {
	const methods = useForm<TAddProductFormData>({ mode: 'onBlur' });

	return (
		<FormProvider {...methods}>
			<AddProduct />
		</FormProvider>
	);
};
