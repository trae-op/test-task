'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TSettingsProductTypeFormData } from '../../hooks/productType/types';

import { FormProductType } from './Form';
import { ProductTypeList } from './List';

export const ProductTypeContainer = () => {
	const methods = useForm<TSettingsProductTypeFormData>({ mode: 'onBlur' });

	return (
		<FormProvider {...methods}>
			<ProductTypeList />
			<FormProductType />
		</FormProvider>
	);
};
