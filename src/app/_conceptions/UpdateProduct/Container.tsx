'use client';

import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { TUpdateFormData } from '@/hooks/updateProduct/types';

import { convertISODateToInputDate } from '@/utils/dateTime';

import { UpdateForm } from './UpdateForm';
import type { TUpdateContainerProps } from './types';

export const Container = ({ values }: TUpdateContainerProps) => {
	const defaultValues = useMemo(() => {
		return {
			title: values?.title || '',
			serialNumber: values?.serialNumber || '',
			type: values?.type || '',
			photo: values?.photo || '',
			specification: values?.specification || '',
			guaranteeStart: convertISODateToInputDate(
				values?.guaranteeStart?.toISOString() || ''
			),
			guaranteeEnd: convertISODateToInputDate(
				values?.guaranteeEnd?.toISOString() || ''
			),
			orderId: values?.orderId || '',
			isNew: values?.isNew || false,
			prices: values?.prices
				? values.prices.map(price => ({
						value: price.symbol + '',
						label: `${price.isDefault ? 'Default' : ''} ${price.value} ${price.symbol}`,
						valueAmount: Number(price.value),
						id: price.id,
						userId: price.userId,
						isDefault: price.isDefault
					}))
				: []
		};
	}, [values]);
	const methods = useForm<TUpdateFormData>({
		mode: 'onBlur',
		defaultValues
	});

	return (
		<FormProvider {...methods}>
			<UpdateForm />
		</FormProvider>
	);
};
