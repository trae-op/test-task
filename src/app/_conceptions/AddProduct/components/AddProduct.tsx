'use client';

import { useTranslations } from 'next-intl';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';
import { PricesForm } from '@/components/PricesForm';

import { useAddProductActions } from '../hooks';
import { TAddProductFormExtended } from '../types';

import { SubmitButton } from './SubmitButton';
import {
	GuaranteeEndField,
	GuaranteeStartField,
	SpecificationField,
	TitleField,
	TypeField
} from './fields';
import { IsNewField } from './fields/IsNewField';

export const AddProduct = () => {
	const t = useTranslations('App');

	const form = useFormContext<TAddProductFormExtended>();
	const { onAddProductSubmit, error } = useAddProductActions();

	const handleActionForm = async () => {
		const isValid = await form.trigger();
		if (!isValid) {
			return;
		}
		const values = form.getValues();
		onAddProductSubmit(values);
	};

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Add product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={error} type='error' />
				<Form noValidate action={handleActionForm}>
					<TitleField />
					<TypeField />
					<SpecificationField />
					<GuaranteeStartField />
					<GuaranteeEndField />
					<IsNewField />
					<PricesForm />

					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
