'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';

import {
	UPPERCASE_VALUE_PATTERN,
	validationMessagesExtended
} from '@/utils/regExp';

import { useActions } from '../../hooks/currency';
import type { TSettingsCurrencyFormData } from '../../hooks/currency/types';

import { CurrencyList } from './List';
import { SubmitButton } from './SubmitButton';

export const FormCurrency = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const form = useFormContext<TSettingsCurrencyFormData>();
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

	const {
		register,
		formState: { errors }
	} = form;

	return (
		<Card>
			<Card.Header as='h5' className='text-center'>
				{t('Add currency')}
			</Card.Header>
			<Card.Body>
				<CurrencyList />
				<MessagesServer message={state.message} type='error' />
				<Form
					noValidate
					action={handleActionForm}
					onSubmitCapture={onSubmitCapture}
				>
					<Form.Group className='mb-3' controlId='cr-title'>
						<Form.Label>{t('Title')}</Form.Label>
						<Form.Control
							{...register('title', { required: t('This field is required') })}
							type='text'
							placeholder={t('Enter title')}
							isInvalid={!!errors.title}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.title?.message as string}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='cr-value'>
						<Form.Label>{t('Value')}</Form.Label>
						<Form.Control
							{...register('value', {
								required: t('This field is required'),
								pattern: {
									value: UPPERCASE_VALUE_PATTERN,
									message: t(validationMessagesExtended.valueUppercase)
								}
							})}
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
