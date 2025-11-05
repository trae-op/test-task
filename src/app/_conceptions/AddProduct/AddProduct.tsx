'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import { PricesForm } from '@/components/PricesForm';
import type { SelectOption } from '@/components/SelectField/types';

import type { TAddProductFormData } from '@/hooks/addProduct/types';
import { useAddProductActions } from '@/hooks/addProduct/useActions';

import {
	GuaranteeEndField,
	GuaranteeStartField,
	SpecificationField,
	TitleField,
	TypeField
} from './fields';

const TYPE_OPTIONS: SelectOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'laptop', label: 'Laptop' },
	{ value: 'monitor', label: 'Monitor' }
];

const currencyOptions = [
	{ value: 'USD', label: 'USD' },
	{ value: 'UAH', label: 'UAH' }
];

export const AddProduct = () => {
	const t = useTranslations('App');

	const {
		handleSubmit,
		formState: { isSubmitting }
	} = useFormContext<TAddProductFormData>();

	const { onAddProductSubmit, state, isPending } = useAddProductActions();

	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TAddProductFormData) => {
		onAddProductSubmit(data);
	};

	console.log('RERENDER AddProduct', isLoading);

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Add product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<TitleField />
					<TypeField typeOptions={TYPE_OPTIONS} />
					<SpecificationField />
					<GuaranteeStartField />
					<GuaranteeEndField />

					<PricesForm currencyOptions={currencyOptions} />

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
