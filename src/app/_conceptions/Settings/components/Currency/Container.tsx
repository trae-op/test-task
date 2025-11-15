'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TSettingsCurrencyFormData } from '../../hooks/currency/types';

import { FormCurrency } from './Form';

export const CurrencyContainer = () => {
	const methods = useForm<TSettingsCurrencyFormData>({ mode: 'onBlur' });

	return (
		<FormProvider {...methods}>
			<FormCurrency />
		</FormProvider>
	);
};
