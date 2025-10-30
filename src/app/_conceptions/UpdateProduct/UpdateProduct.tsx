'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MultiValue } from 'react-select';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import type { OptionType } from '@/components/MultiSelectField/types';
import { SelectField } from '@/components/SelectField';
import type { SelectOption } from '@/components/SelectField/types';
import { TextField } from '@/components/TextField';

import type { TUpdateProductFormData } from '@/hooks/updateProduct/types';
import { useUpdateProductActions } from '@/hooks/updateProduct/useActions';

import { Price } from './Price';
import type { TUpdateProductProps } from './types';

const toSelectValue = (options: SelectOption[], value?: string | number) => {
	if (value === undefined || value === '') return '';
	const match = options.find(o => String(o.value) === String(value));
	return match ? match.value : '';
};

const convertISODateToInputDate = (isoString: string): string => {
	// Якщо рядок порожній або не існує, повертаємо порожній рядок
	if (!isoString) return '';

	// Обрізаємо рядок до перших 10 символів (YYYY-MM-DD)
	// Наприклад: "2025-02-02T00:00:00.000Z" -> "2025-02-02"
	return isoString.substring(0, 10);
};

const formatDateToInput = (dateString?: string) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toISOString().split('T')[0];
};

export const UpdateProduct = ({
	typeOptions,
	currencyOptions,
	defaultValues
}: TUpdateProductProps) => {
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
	} = useForm<TUpdateProductFormData>({ mode: 'onBlur', defaultValues });

	// Selected prices accumulated via Price component
	const [prices, setPrices] = useState<MultiValue<OptionType>>([]);

	const { onUpdateProductSubmit, state, isPending } = useUpdateProductActions();

	const watchType = useWatch({ control, name: 'type' });
	const watchGuaranteeStart = useWatch({ control, name: 'guaranteeStart' });
	const watchGuaranteeEnd = useWatch({ control, name: 'guaranteeEnd' });

	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TUpdateProductFormData) => {
		const defaultPrices = defaultValues?.prices || [];
		console.log('>>> onFormSubmit defaultPrices:', defaultPrices);
		onUpdateProductSubmit(data, prices.length ? prices : defaultPrices, locale);
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
								<Controller
									name='guaranteeStart'
									control={control}
									defaultValue={defaultValues?.guaranteeStart}
									render={({ field }) => (
										<TextField
											{...field}
											type='date'
											isInvalid={!!errors.guaranteeStart}
											errorMessage={errors.guaranteeStart?.message}
										/>
									)}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className='mb-3' controlId='guaranteeEnd'>
								<Form.Label>{t('Guarantee end')}</Form.Label>
								<Controller
									name='guaranteeEnd'
									control={control}
									defaultValue={defaultValues?.guaranteeEnd}
									rules={{
										validate: value => {
											if (!value || !watchGuaranteeStart) return true;
											return (
												new Date(value) >= new Date(watchGuaranteeStart) ||
												'End date must be after start date'
											);
										}
									}}
									render={({ field }) => (
										<TextField
											{...field}
											type='date'
											isInvalid={!!errors.guaranteeEnd}
											errorMessage={errors.guaranteeEnd?.message}
										/>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>

					{/* Price builder (encapsulated) */}
					<Price
						currencyOptions={currencySelectOptions}
						prices={defaultValues?.prices || []}
						onChange={setPrices}
					/>

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
