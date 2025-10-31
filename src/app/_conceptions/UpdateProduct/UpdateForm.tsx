'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import { PricesForm } from '@/components/PricesForm';

import { useUpdateActions } from '@/hooks/updateProduct/useActions';

import { GuaranteeEndField } from './fields/GuaranteeEndField';
import { GuaranteeStartField } from './fields/GuaranteeStartField';
import { IsNewField } from './fields/IsNewField';
import { SpecificationField } from './fields/SpecificationField';
import { TitleField } from './fields/TitleField';
import { TypeField } from './fields/TypeField';
import type { TPriceOption, TUpdateFormData } from './types';

const currencyOptions: TPriceOption[] = [
	{ value: 'USD', label: 'USD' },
	{ value: 'UAH', label: 'UAH' }
];

export const UpdateForm = () => {
	const t = useTranslations('App');

	const {
		handleSubmit,
		formState: { isSubmitting }
	} = useFormContext<TUpdateFormData>();

	const { onUpdateSubmit, state, isPending } = useUpdateActions();

	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TUpdateFormData) => {
		onUpdateSubmit(data);
	};

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Update product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<TitleField />
					<TypeField />
					<SpecificationField />
					<GuaranteeStartField />
					<GuaranteeEndField />
					<IsNewField />
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
