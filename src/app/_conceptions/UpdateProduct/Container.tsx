'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TUpdateProductFormData } from '@/hooks/updateProduct/types';

import { UpdateProduct } from './UpdateProduct';
import type { TUpdateProductProps } from './types';

export const Container = (props: TUpdateProductProps) => {
	const { defaultValues } = props;

	const methods = useForm<TUpdateProductFormData>({
		mode: 'onBlur',
		defaultValues
	});

	return (
		<FormProvider {...methods}>
			<UpdateProduct {...props} />
		</FormProvider>
	);
};
