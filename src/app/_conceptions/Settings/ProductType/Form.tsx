'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';

import { useActions } from '@/hooks/settings/productType';
import type { TSettingsProductTypeFormData } from '@/hooks/settings/productType/types';

import { SubmitButton } from './SubmitButton';

export const FormProductType = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const form = useFormContext<TSettingsProductTypeFormData>();
	const { onSubmit, state } = useActions();
	const { pending } = useFormStatus();

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

	const {
		register,
		formState: { errors, isSubmitting }
	} = form;

	const isLoading = isSubmitting || pending;

	return (
		<Card>
			<Card.Header as='h5' className='text-center'>
				{t('Add product type')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form
					noValidate
					action={handleActionForm}
					onSubmitCapture={onSubmitCapture}
				>
					<Form.Group className='mb-3' controlId='pt-title'>
						<Form.Label>{t('Title')}</Form.Label>
						<Form.Control
							{...register('title', { required: te('required') })}
							type='text'
							placeholder={t('Enter title')}
							isInvalid={!!errors.title}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.title?.message as string}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='pt-value'>
						<Form.Label>{t('Value')}</Form.Label>
						<Form.Control
							{...register('value', { required: te('required') })}
							type='text'
							placeholder={t('Enter value')}
							isInvalid={!!errors.value}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.value?.message as string}
						</Form.Control.Feedback>
					</Form.Group>

					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
