'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';
import { useUpdateOrderForm } from '@/hooks/updateOrder/useUpdateOrderForm';

import { DescriptionField } from './fields/DescriptionField';
import { ProductsField } from './fields/ProductsField';
import { TitleField } from './fields/TitleField';

export const UpdateForm = () => {
	const t = useTranslations('App');

	const {
		formState: { isSubmitting },
		handleSubmit
	} = useFormContext<TUpdateOrderFormData>();

	const { onSubmit, isLoading, error } = useUpdateOrderForm();

	const loading = isSubmitting || isLoading;

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Update receipt')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={error} type='error' />
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<TitleField />
					<DescriptionField />
					<ProductsField />

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Submit')}
							type='submit'
							variant='success'
							isLoading={loading}
							disabled={loading}
							className='ps-3 pe-3'
						/>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
