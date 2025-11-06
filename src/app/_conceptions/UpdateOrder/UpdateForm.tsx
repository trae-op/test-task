'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';

import type { TUpdateOrderFormData } from '@/hooks/updateOrder/types';
import { useUpdateOrderForm } from '@/hooks/updateOrder/useUpdateOrderForm';

import { SubmitButton } from './SubmitButton';
import { DescriptionField } from './fields/DescriptionField';
import { ProductsField } from './fields/ProductsField';
import { TitleField } from './fields/TitleField';
import { updateOrder } from '@/actions/updateOrder/action';
import type { TUpdateOrderSubmitState } from '@/actions/updateOrder/types';

export const UpdateForm = () => {
	const t = useTranslations('App');
	const form = useFormContext<TUpdateOrderFormData>();

	const { onSubmit } = useUpdateOrderForm();

	const [state, formAction] = useActionState<TUpdateOrderSubmitState, FormData>(
		updateOrder,
		{ ok: false }
	);

	const handleActionForm = () => {
		const values = form.getValues();
		onSubmit(values, (fd: FormData) => {
			formAction(fd);
		});
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
				{t('Update receipt')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
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
