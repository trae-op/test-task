'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';
import { MultiValue } from 'react-select';

import { Button } from '@/components/ui/Button';
import { ErrorServer } from '@/components/ui/ErrorServer';
import { MultiSelectField } from '@/components/ui/MultiSelectField';
import type { OptionType } from '@/components/ui/MultiSelectField/types';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField/types';
import { TextField } from '@/components/ui/TextField';

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
	const t = useTranslations('App.addProduct');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		control
	} = useForm<TAddProductFormData>({ mode: 'onBlur' });

	const [prices, setPrices] = useState<MultiValue<OptionType>>([]);

	const { onAddProductSubmit, state, isPending } = useAddProductActions();

	const mappedErrors = errors as any;
	const watchType = useWatch({ control, name: 'type' });
	const watchOrderId = useWatch({ control, name: 'orderId' });
	const watchGuaranteeStart = useWatch({ control, name: 'guaranteeStart' });

	const onFormSubmit = (data: TAddProductFormData) => {
		onAddProductSubmit(data, prices, locale);
	};

	const currencySelectOptions = useMemo(
		() => currencyOptions,
		[currencyOptions]
	);

	return (
		<Container>
			<Row className='justify-content-center'>
				<Col xs={12} md={10} lg={8} xl={6}>
					<Card>
						<Card.Header as='h4'>{t('title')}</Card.Header>
						<Card.Body>
							<ErrorServer message={state.message} />
							<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
								<Form.Group className='mb-3' controlId='title'>
									<Form.Label>{t('titleLabel')}</Form.Label>
									<TextField
										{...register('title', {
											required: te('required')
										})}
										type='text'
										placeholder={t('enterTitle')}
										isInvalid={!!mappedErrors.title}
										errorMessage={mappedErrors.title?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='serialNumber'>
									<Form.Label>{t('serialNumber')}</Form.Label>
									<TextField
										{...register('serialNumber', {
											required: te('required')
										})}
										type='text'
										placeholder={t('enterSerialNumber')}
										isInvalid={!!mappedErrors.serialNumber}
										errorMessage={mappedErrors.serialNumber?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='type'>
									<Form.Label>{t('type')}</Form.Label>
									<SelectField
										options={typeOptions}
										value={toSelectValue(typeOptions, watchType)}
										onChange={e => {
											setValue('type', e.target.value);
										}}
										placeholder={t('selectType')}
									/>
									<input type='hidden' {...register('type')} />
								</Form.Group>

								<Form.Group className='mb-3' controlId='specification'>
									<Form.Label>{t('specification')}</Form.Label>
									<TextField
										{...register('specification')}
										as='textarea'
										placeholder={t('enterSpecification')}
									/>
								</Form.Group>

								<Row>
									<Col>
										<Form.Group className='mb-3' controlId='guaranteeStart'>
											<Form.Label>{t('guaranteeStart')}</Form.Label>
											<TextField {...register('guaranteeStart')} type='date' />
										</Form.Group>
									</Col>
									<Col>
										<Form.Group className='mb-3' controlId='guaranteeEnd'>
											<Form.Label>{t('guaranteeEnd')}</Form.Label>
											<TextField
												{...register('guaranteeEnd', {
													validate: value => {
														if (!value || !watchGuaranteeStart) return true;
														return (
															new Date(value) >=
																new Date(watchGuaranteeStart) ||
															'End date must be after start date'
														);
													}
												})}
												type='date'
												isInvalid={!!mappedErrors.guaranteeEnd}
												errorMessage={mappedErrors.guaranteeEnd?.message}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Form.Group className='mb-3' controlId='order'>
									<Form.Label>{t('order')}</Form.Label>
									<SelectField
										options={orderOptions}
										value={toSelectValue(orderOptions, watchOrderId)}
										onChange={e => {
											setValue('orderId', e.target.value);
										}}
										placeholder={t('selectOrder')}
									/>
									<input type='hidden' {...register('orderId')} />
								</Form.Group>

								<Form.Group className='mb-3' controlId='prices'>
									<Form.Label>{t('prices')}</Form.Label>
									<MultiSelectField
										instanceId='product-prices'
										options={currencySelectOptions}
										value={prices}
										onChange={setPrices}
										placeholder={t('selectCurrencies')}
									/>
								</Form.Group>

								<Button
									text={t('submit')}
									type='submit'
									variant='success'
									className='w-100'
									disabled={isSubmitting || isPending}
								/>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
