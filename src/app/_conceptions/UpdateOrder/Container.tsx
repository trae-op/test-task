'use client';

import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

import { UpdateForm } from './UpdateForm';
import type { TUpdateContainerProps } from './types';

export const Container = ({ values, products }: TUpdateContainerProps) => {
	const productOptions: OptionType[] = useMemo(
		() =>
			products.map(p => ({
				value: p.id,
				label: p.title ?? ''
			})),
		[products]
	);

	const productsSelected = useMemo<OptionType[]>(() => {
		const ids = new Set((values?.products || []).map(p => p.id));
		return productOptions.filter(o => ids.has(String(o.value)));
	}, [values?.products, productOptions]);

	const defaultValues = useMemo<TUpdateOrderFormData>(
		() => ({
			orderId: values?.id || '',
			title: values?.title || '',
			description: values?.description || undefined,
			productsSelected,
			productOptions
		}),
		[values, productsSelected, productOptions]
	);

	const methods = useForm<TUpdateOrderFormData>({
		mode: 'onBlur',
		defaultValues
	});

	return (
		<FormProvider {...methods}>
			<UpdateForm />
		</FormProvider>
	);
};
