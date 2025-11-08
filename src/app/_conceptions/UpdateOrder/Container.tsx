'use client';

import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { OptionType } from '@/components/MultiSelectField/types';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';

import type { TLocationFormValue } from '@/types/location';

import { UpdateForm } from './UpdateForm';
import type { TUpdateContainerProps } from './types';

type TOrderLocationDetails = {
	latitude: number;
	longitude: number;
	country?: string | null;
	state?: string | null;
	city?: string | null;
	district?: string | null;
	street?: string | null;
	postcode?: string | null;
	displayName?: string | null;
};

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

	const locationDefault = useMemo<TLocationFormValue | undefined>(() => {
		const entity = values?.location as TOrderLocationDetails | undefined;
		if (!entity) return undefined;

		return {
			lat: entity.latitude,
			lng: entity.longitude,
			country: entity.country ?? undefined,
			state: entity.state ?? undefined,
			city: entity.city ?? undefined,
			district: entity.district ?? undefined,
			street: entity.street ?? undefined,
			postcode: entity.postcode ?? undefined,
			displayName: entity.displayName ?? undefined
		};
	}, [values?.location]);

	const defaultValues = useMemo<TUpdateOrderFormData>(
		() => ({
			orderId: values?.id || '',
			title: values?.title || '',
			description: values?.description || undefined,
			productsSelected,
			productOptions,
			location: locationDefault
		}),
		[values, productsSelected, productOptions, locationDefault]
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
