'use client';

import { FormProvider, useForm } from 'react-hook-form';

import type { TSettingsCurrencyFormData } from '../../hooks/currency/types';

import { FormCurrency } from './Form';
import { CurrencyList } from './List';

export const CurrencyContainer = () => {
	const methods = useForm<TSettingsCurrencyFormData>({ mode: 'onBlur' });

	return (
		<FormProvider {...methods}>
			<CurrencyList />
			<FormCurrency />
		</FormProvider>
	);
};
