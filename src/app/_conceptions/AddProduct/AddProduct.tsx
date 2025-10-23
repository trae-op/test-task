'use client';

import { Price } from '.';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';
import { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import type { OptionType } from '@/components/MultiSelectField/types';
import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';
import { TextField } from '@/components/TextField';

import type { TAddProductFormData } from '@/hooks/addProduct/types';
import { useAddProductActions } from '@/hooks/addProduct/useAddProductActions';

import type { TAddProductProps } from './types';

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

export const AddProduct = ({
	typeOptions,
	orderOptions,
	currencyOptions
}: TAddProductProps) => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		control
	} = useForm<TAddProductFormData>({ mode: 'onBlur' });

	// Selected prices accumulated via Price component
	const [prices, setPrices] = useState<MultiValue<OptionType>>([]);

	const { onAddProductSubmit, state, isPending } = useAddProductActions();

	const watchType = useWatch({ control, name: 'type' });
	const watchOrderId = useWatch({ control, name: 'orderId' });
	const watchGuaranteeStart = useWatch({ control, name: 'guaranteeStart' });

	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TAddProductFormData) => {
		onAddProductSubmit(data, prices, locale);
	};

	const currencySelectOptions = useMemo(
		() => currencyOptions,
		[currencyOptions]
	);

	return (
		<Card>
			<Card.Header as='h4' className='text-center'>
				{t('Add product')}
			</Card.Header>
			<Card.Body>
				<MessagesServer message={state.message} type='error' />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='title'>
						<Form.Label>{t('Title')}</Form.Label>
						<TextField
							{...register('title', {
								required: te('required')
							})}
							type='text'
							placeholder={t('Enter title')}
							isInvalid={!!errors.title}
							errorMessage={errors.title?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='type'>
						<Form.Label>{t('Type')}</Form.Label>
						<SelectField
							options={typeOptions}
							value={toSelectValue(typeOptions, watchType)}
							onChange={e => {
								setValue('type', e.target.value);
							}}
							placeholder={t('Select type')}
						/>
						<input type='hidden' {...register('type')} />
					</Form.Group>

					<Form.Group className='mb-3' controlId='specification'>
						<Form.Label>{t('Specification')}</Form.Label>
						<TextField
							{...register('specification')}
							as='textarea'
							placeholder={t('Enter specification')}
						/>
					</Form.Group>

					<Row>
						<Col>
							<Form.Group className='mb-3' controlId='guaranteeStart'>
								<Form.Label>{t('Guarantee start')}</Form.Label>
								<TextField {...register('guaranteeStart')} type='date' />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className='mb-3' controlId='guaranteeEnd'>
								<Form.Label>{t('Guarantee end')}</Form.Label>
								<TextField
									{...register('guaranteeEnd', {
										validate: value => {
											if (!value || !watchGuaranteeStart) return true;
											return (
												new Date(value) >= new Date(watchGuaranteeStart) ||
												'End date must be after start date'
											);
										}
									})}
									type='date'
									isInvalid={!!errors.guaranteeEnd}
									errorMessage={errors.guaranteeEnd?.message}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className='mb-3' controlId='order'>
						<Form.Label>{t('Order')}</Form.Label>
						<SelectField
							options={orderOptions}
							value={toSelectValue(orderOptions, watchOrderId)}
							onChange={e => {
								setValue('orderId', e.target.value);
							}}
							placeholder={t('Select order')}
						/>
						<input type='hidden' {...register('orderId')} />
					</Form.Group>

					{/* Price builder (encapsulated) */}
					<Price currencyOptions={currencySelectOptions} onChange={setPrices} />

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
