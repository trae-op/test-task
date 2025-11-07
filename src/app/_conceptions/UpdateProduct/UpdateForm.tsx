'use client';

import { useTranslations } from 'next-intl';
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
import type { TUpdateFormExtended } from './types';

export const UpdateForm = () => {
	const t = useTranslations('App');
	const form = useFormContext<TUpdateFormExtended>();
	const { onUpdateSubmit, error } = useUpdateActions();

	const handleActionForm = () => {
		const values = form.getValues();
		onUpdateSubmit(values);
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
				<MessagesServer message={error} type='error' />
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
