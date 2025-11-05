'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TUpdateFormData } from '@/hooks/updateProduct/types';

import { AddProduct } from './AddProduct';

export const Container = () => {
	const methods = useForm<TUpdateFormData>({
		mode: 'onBlur'
	});

	return (
		<FormProvider {...methods}>
			<AddProduct />
		</FormProvider>
	);
};
