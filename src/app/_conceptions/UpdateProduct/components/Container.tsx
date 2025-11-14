'use client';

import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { convertISODateToInputDate } from '@/utils/dateTime';

import type { TUpdateContainerProps, TUpdateFormExtended } from '../types';

import { UpdateForm } from './UpdateForm';

export const Container = ({
	values,
	productType,
	currency
}: TUpdateContainerProps) => {
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
				: [],
			productType,
			currency
		};
	}, [values, productType, currency]);
	const methods = useForm<TUpdateFormExtended>({
		mode: 'onBlur',
		defaultValues
	});

	return (
		<FormProvider {...methods}>
			<UpdateForm />
		</FormProvider>
	);
};
