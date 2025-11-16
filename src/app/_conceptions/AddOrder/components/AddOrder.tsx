'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import { MessagesServer } from '@/components/MessagesServer';
import type { OptionType } from '@/components/MultiSelectField/types';
import { TextField } from '@/components/TextField';

import { useAddOrderActions } from '../hooks/useAddActions';
import type { TAddOrderFormData, TAddOrderProps } from '../types';

import { SubmitButton } from './SubmitButton';

const MultiSelectField = dynamic(
	() =>
		import('@/components/MultiSelectField').then(mod => mod.MultiSelectField),
	{ ssr: false }
);

export const AddOrder = ({ products }: TAddOrderProps) => {
	const t = useTranslations('App');
	const productOptions: OptionType[] = useMemo(
		() =>
			products.map(p => ({
				value: p.id,
				label: p.title ?? ''
			})),
		[products]
	);

	const form = useForm<TAddOrderFormData>({
		mode: 'onBlur',
		defaultValues: { products: [] }
	});
	const {
		register,
		formState: { errors }
	} = form;

	const [selectedProducts, setSelectedProducts] = useState<
		MultiValue<OptionType>
	>([]);

	const { onAddOrderSubmit, error } = useAddOrderActions();

	const onChange = (value: MultiValue<OptionType>) => {
		setSelectedProducts(value);
	};

	const handleActionForm = async () => {
		const isValid = await form.trigger();
		if (!isValid) {
			return;
		}
		const values = form.getValues();
		onAddOrderSubmit(values, selectedProducts);
	};

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Add order')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={error} type='error' />
				<FormProvider {...form}>
					<Form
						noValidate
						action={handleActionForm}
						data-testid='add-order-form'
					>
						<Form.Group className='mb-3' controlId='title'>
							<Form.Label>{t('Title')}</Form.Label>
							<TextField
								{...register('title', {
									required: t('This field is required')
								})}
								type='text'
								placeholder={t('Enter title')}
								isInvalid={!!errors.title}
								errorMessage={errors.title?.message}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId='description'>
							<Form.Label>{t('Description')}</Form.Label>
							<TextField
								{...register('description')}
								as='textarea'
								placeholder={t('Enter description')}
							/>
						</Form.Group>

						<Form.Group className='mb-4' controlId='products'>
							<Form.Label>{t('Products')}</Form.Label>
							<MultiSelectField
								options={productOptions}
								value={selectedProducts}
								onChange={onChange}
								closeMenuOnSelect={false}
								placeholder={t('Select')}
							/>
						</Form.Group>

						<SubmitButton />
					</Form>
				</FormProvider>
			</Card.Body>
		</Card>
	);
};
