'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { MessagesServer } from '@/components/MessagesServer';
import { PricesForm } from '@/components/PricesForm';

import { useUpdateActions } from '@/hooks/updateProduct/useActions';

import { PictureProduct } from './Picture';
import { SubmitButton } from './SubmitButton';
import { GuaranteeEndField } from './fields/GuaranteeEndField';
import { GuaranteeStartField } from './fields/GuaranteeStartField';
import { IsNewField } from './fields/IsNewField';
import { SpecificationField } from './fields/SpecificationField';
import { TitleField } from './fields/TitleField';
import { TypeField } from './fields/TypeField';
import type { TUpdateFormData } from './types';
import { updateProduct } from '@/actions/updateProduct';
import type { TUpdateSubmitState } from '@/actions/updateProduct/types';

export const UpdateForm = () => {
	const t = useTranslations('App');
	const form = useFormContext<TUpdateFormData>();
	const { onUpdateSubmit } = useUpdateActions();

	const [state, formAction] = useActionState<TUpdateSubmitState, FormData>(
		updateProduct,
		{ ok: false }
	);

	const handleActionForm = () => {
		const values = form.getValues();
		onUpdateSubmit(values, (fd: FormData) => {
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
				{t('Update product')}
			</Card.Header>
			<Card.Body>
				<PictureProduct />
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
					<IsNewField />
					<PricesForm />
					<SubmitButton />
				</Form>
			</Card.Body>
		</Card>
	);
};
