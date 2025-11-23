'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';

import {
	LOWERCASE_VALUE_PATTERN,
	validationMessagesExtended
} from '@/utils/regExp';

import { useActions } from '../../hooks/productType';
import type { TSettingsProductTypeFormData } from '../../hooks/productType/types';

import { ProductTypeList } from './List';
import { SubmitButton } from './SubmitButton';

export const FormProductType = () => {
	const t = useTranslations('App');
	const form = useFormContext<TSettingsProductTypeFormData>();
	const { onSubmit, state } = useActions();

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

	const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		form.setValue('title', value);
		form.setValue('value', value.toLocaleLowerCase().replace(/\s/g, ''));
	};

	const {
		register,
		formState: { errors }
	} = form;

	return (
		<Card>
			<Card.Header
				as='h5'
				className='text-center'
				data-testid='settings-product-type-header'
			>
				{t('Add product type')}
			</Card.Header>
			<Card.Body>
				<ProductTypeList />
				<MessagesServer message={state.message} type='error' />
				<Form
					data-testid='settings-product-type-form'
					noValidate
					action={handleActionForm}
					onSubmitCapture={onSubmitCapture}
				>
					<Form.Group className='mb-3' controlId='pt-title'>
						<Form.Label>{t('Title')}</Form.Label>
						<Form.Control
							{...register('title', { required: t('This field is required') })}
							type='text'
							onChange={handleChangeTitle}
							placeholder={t('Enter title')}
							isInvalid={!!errors.title}
						/>
						<Form.Control.Feedback
							type='invalid'
							data-testid='settings-product-type-error-title'
						>
							{errors.title?.message as string}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='pt-value'>
						<Form.Label>{t('Value')}</Form.Label>
						<Form.Control
							{...register('value', {
								required: t('This field is required'),
								pattern: {
									value: LOWERCASE_VALUE_PATTERN,
									message: t(validationMessagesExtended.valueLowercase)
								}
							})}
							type='text'
							placeholder={t('Enter value')}
							isInvalid={!!errors.value}
						/>
						<Form.Control.Feedback
							type='invalid'
							data-testid='settings-product-type-error-value'
						>
							{errors.value?.message as string}
						</Form.Control.Feedback>
					</Form.Group>

					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
