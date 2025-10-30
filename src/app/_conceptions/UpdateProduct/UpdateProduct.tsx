'use client';

import { is } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import {
	Controller,
	FormProvider,
	useForm,
	useFormContext,
	useWatch
} from 'react-hook-form';
import { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import type { OptionType } from '@/components/MultiSelectField/types';
import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';
import { TextField } from '@/components/TextField';

import type { TUpdateProductFormData } from '@/hooks/updateProduct/types';
import { useUpdateProductActions } from '@/hooks/updateProduct/useActions';

import { GuaranteeEndField } from './fields/GuaranteeEndField';
import { GuaranteeStartField } from './fields/GuaranteeStartField';
import { IsNewField } from './fields/IsNewField';
import { PriceField } from './fields/PriceField';
import { SpecificationField } from './fields/SpecificationField';
// import independent field components (to be created)
import { TitleField } from './fields/TitleField';
import { TypeField } from './fields/TypeField';
import type { TUpdateProductProps } from './types';

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

export const UpdateProduct = ({
	typeOptions,
	currencyOptions,
	defaultValues
}: TUpdateProductProps) => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';

	//console.log('>>> defaultValues:', defaultValues);

	const {
		handleSubmit,
		formState: { isSubmitting },
		control
	} = useFormContext<TUpdateProductFormData>();

	// Selected prices accumulated via Price component
	const [prices, setPrices] = useState<MultiValue<OptionType>>([]);
	// isNew now managed by react-hook-form Controller

	const { onUpdateProductSubmit, state, isPending } = useUpdateProductActions();

	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TUpdateProductFormData) => {
		const defaultPrices = defaultValues?.prices || [];
		//console.log('>>> onFormSubmit defaultPrices:', defaultPrices);
		onUpdateProductSubmit(data, prices.length ? prices : defaultPrices, locale);
	};

	const currencySelectOptions = useMemo(
		() => currencyOptions,
		[currencyOptions]
	);

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Update product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					{/* Replace with independent field components */}
					<TitleField />
					<TypeField typeOptions={typeOptions} />
					<SpecificationField />
					<GuaranteeStartField />
					<GuaranteeEndField />
					<IsNewField />
					<PriceField currencyOptions={currencySelectOptions} />
					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Submit')}
							type='submit'
							variant='success'
							isLoading={isLoading}
							disabled={isLoading}
							className='ps-3 pe-3'
						/>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
