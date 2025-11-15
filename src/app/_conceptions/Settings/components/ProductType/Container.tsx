'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TSettingsProductTypeFormData } from '../../hooks/productType/types';

import { FormProductType } from './Form';

export const ProductTypeContainer = () => {
	const methods = useForm<TSettingsProductTypeFormData>({ mode: 'onBlur' });

	return (
		<FormProvider {...methods}>
			<FormProductType />
		</FormProvider>
	);
};
