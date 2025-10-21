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
	const tg = useTranslations('App');
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

	// Local state for building individual price entries
	const [priceAmount, setPriceAmount] = useState<string>('');
	const [priceCurrency, setPriceCurrency] = useState<string>('');
	const [priceIsDefault, setPriceIsDefault] = useState<boolean>(false);
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

	const onAddPrice = () => {
		const amountNum = Number(priceAmount);
		if (!priceCurrency) return;
		if (Number.isNaN(amountNum) || amountNum <= 0) return;

		// create enriched option: label shows amount + currency, carry amount and default as extra fields
		const newOption: any = {
			value: priceCurrency,
			label: `${amountNum} ${priceCurrency}`,
			valueAmount: amountNum,
			isDefault: priceIsDefault
		};

		setPrices(prev => {
			// replace existing for same currency, else append
			let next = prev.filter((p: any) => p.value !== priceCurrency);
			next = [...next, newOption];
			// ensure only one default if this one is default
			if (priceIsDefault) {
				next = next.map((p: any) => ({
					...p,
					isDefault: p.value === priceCurrency
				}));
			}
			return next as MultiValue<OptionType>;
		});

		// reset input fields (keep currency for faster entry)
		setPriceAmount('');
		setPriceIsDefault(false);
	};

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

								{/* Price builder fields */}
								<Row>
									<Col md={4}>
										<Form.Group className='mb-3' controlId='priceAmount'>
											<Form.Label>Amount</Form.Label>
											<TextField
												type='number'
												min='0'
												step='0.01'
												value={priceAmount}
												onChange={e => setPriceAmount(e.target.value)}
												placeholder='0.00'
											/>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className='mb-3' controlId='priceCurrency'>
											<Form.Label>Currency</Form.Label>
											<SelectField
												options={currencySelectOptions.map(o => ({
													value: o.value,
													label: o.label
												}))}
												value={toSelectValue(
													currencySelectOptions.map(o => ({
														value: o.value,
														label: o.label
													})),
													priceCurrency
												)}
												onChange={e => setPriceCurrency(e.target.value)}
												placeholder={t('selectCurrencies')}
											/>
										</Form.Group>
									</Col>
									<Col md={2} className='d-flex align-items-end'>
										<Form.Group className='mb-3' controlId='priceDefault'>
											<div className='form-check'>
												<input
													className='form-check-input'
													type='checkbox'
													checked={priceIsDefault}
													onChange={e => setPriceIsDefault(e.target.checked)}
													id='isDefaultPrice'
												/>
												<label
													className='form-check-label'
													htmlFor='isDefaultPrice'
												>
													Default
												</label>
											</div>
										</Form.Group>
									</Col>
									<Col md={2} className='d-flex align-items-end'>
										<Button
											text={tg('Add')}
											variant='primary'
											onClick={onAddPrice}
											className='w-100'
										/>
									</Col>
								</Row>

								<Form.Group className='mb-3' controlId='prices'>
									<Form.Label>{t('prices')}</Form.Label>
									<MultiSelectField
										instanceId='product-prices'
										options={prices as any}
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
