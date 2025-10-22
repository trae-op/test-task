'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import { MultiSelectField } from '@/components/MultiSelectField';
import type { OptionType } from '@/components/MultiSelectField/types';
import { TextField } from '@/components/TextField';

import { useAddOrderActions } from '@/hooks/addOrder';

import type { TAddOrderFormData, TAddOrderProps } from './types';

export const AddOrder = ({ products }: TAddOrderProps) => {
	const t = useTranslations('App.addOrder');
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
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='title'>
						<Form.Label>{t('titleLabel')}</Form.Label>
						<TextField
							{...register('title', { required: te('required') })}
							type='text'
							placeholder={t('enterTitle')}
							isInvalid={!!errors.title}
							errorMessage={errors.title?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='description'>
						<Form.Label>{t('description')}</Form.Label>
						<TextField
							{...register('description')}
							as='textarea'
							placeholder={t('enterDescription')}
						/>
					</Form.Group>

					<Form.Group className='mb-4' controlId='products'>
						<Form.Label>{t('products')}</Form.Label>
						<MultiSelectField
							options={productOptions}
							value={selectedProducts}
							onChange={v => setSelectedProducts(v)}
							closeMenuOnSelect={false}
						/>
					</Form.Group>

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('submit')}
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
