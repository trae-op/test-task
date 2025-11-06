'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';
import { PricesForm } from '@/components/PricesForm';

import type { TAddProductFormData } from '@/hooks/addProduct/types';
import { useAddProductActions } from '@/hooks/addProduct/useActions';

import { SubmitButton } from './SubmitButton';
import {
	GuaranteeEndField,
	GuaranteeStartField,
	SpecificationField,
	TitleField,
	TypeField
} from './fields';
import { addProductSubmit } from '@/actions/addProduct/submit';
import type { TAddProductSubmitState } from '@/actions/addProduct/types';

export const AddProduct = () => {
	const t = useTranslations('App');
	const form = useFormContext<TAddProductFormData>();
	const { onAddProductSubmit } = useAddProductActions();

	const [state, formAction] = useActionState<TAddProductSubmitState, FormData>(
		addProductSubmit,
		{ ok: false }
	);

	const handleActionForm = () => {
		const values = form.getValues();
		onAddProductSubmit(values, (fd: FormData) => {
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
				{t('Add product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form
					noValidate
					action={handleActionForm}
					onSubmitCapture={onSubmitCapture}
				>
					<TitleField />
					<TypeField />
					<SpecificationField />
					<GuaranteeStartField />
					<GuaranteeEndField />

					<PricesForm />

					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
