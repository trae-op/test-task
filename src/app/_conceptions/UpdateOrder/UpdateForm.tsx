'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';
import { useUpdateActions } from '@/hooks/updateOrder/useUpdateActions';

import { SubmitButton } from './SubmitButton';
import { DescriptionField } from './fields/DescriptionField';
import { ProductsField } from './fields/ProductsField';
import { TitleField } from './fields/TitleField';

export const UpdateForm = () => {
	const t = useTranslations('App');
	const form = useFormContext<TUpdateOrderFormData>();

	const { onSubmit, error } = useUpdateActions();

	const handleActionForm = () => {
		const values = form.getValues();
		onSubmit(values);
	};

	const onSubmitCapture = async (event: React.FormEvent<HTMLFormElement>) => {
		const isValid = await form.trigger();
		if (!isValid) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Update order')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={error} type='error' />
				<Form
					noValidate
					action={handleActionForm}
					onSubmitCapture={onSubmitCapture}
				>
					<TitleField />
					<DescriptionField />
					<ProductsField />

					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
