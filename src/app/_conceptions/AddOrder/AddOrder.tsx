'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import type { OptionType } from '@/components/MultiSelectField/types';
import { TextField } from '@/components/TextField';

import { useAddOrderActions } from '@/hooks/addOrder';

import type { TAddOrderFormData, TAddOrderProps } from './types';

const MultiSelectField = dynamic(
	() =>
		import('@/components/MultiSelectField').then(mod => mod.MultiSelectField),
	{ ssr: false }
);

export const AddOrder = ({ products }: TAddOrderProps) => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const productOptions: OptionType[] = useMemo(
		() =>
			products.map(p => ({
				value: p.id,
				label: p.title ?? ''
			})),
		[products]
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TAddOrderFormData>({
		mode: 'onBlur',
		defaultValues: { products: [] }
	});

	const [selectedProducts, setSelectedProducts] = useState<
		MultiValue<OptionType>
	>([]);

	const { onAddOrderSubmit, state, isPending } = useAddOrderActions();

	const isLoading = isSubmitting || isPending;

	const onChange = (value: MultiValue<OptionType>) => {
		setSelectedProducts(value);
	};

	const onFormSubmit = (data: TAddOrderFormData) => {
		onAddOrderSubmit(
			{
				title: data.title,
				description: data.description
			},
			selectedProducts,
			locale
		);
	};

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Add receipt')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='title'>
						<Form.Label>{t('Title')}</Form.Label>
						<TextField
							{...register('title', { required: te('required') })}
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

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Submit')}
							type='submit'
							variant='success'
							isLoading={isLoading}
							disabled={isLoading}
							className='ps-3 pe-3'
						/>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
