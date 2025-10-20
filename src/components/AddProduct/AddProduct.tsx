'use client';
'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';

import { MultiSelectField } from '@/components/ui/MultiSelectField';
import { RequiredLabel } from '@/components/ui/RequiredLabel';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';

import { useAddProduct } from '@/hooks/addProduct';
import { useAddProductApplyBinding } from '@/hooks/addProduct/useAddProductApplyBinding';

export const AddProductForm = () => {
	const t = useTranslations('App.products');
	const te = useTranslations('App.errors');
	const tp = useTranslations('App.products.placeholders');
	const {
		register,
		errors,
		isSubmitting,
		addProductIsPending,
		typeOptions,
		orderOptions,
		priceOptions,
		selectedPrice,
		selectedOrders,
		handlePriceSelect,
		handleOrdersChange,
		submitViaApply
	} = useAddProduct();

	useAddProductApplyBinding(submitViaApply);

	return (
		<form id='add-product-form' noValidate onSubmit={e => e.preventDefault()}>
			<Form.Group className='mb-3' controlId='formTitle'>
				<RequiredLabel text={t('Title')} />
				<TextField
					{...register('title', { required: te('required') })}
					type='text'
					placeholder={tp('enterTitle')}
					isInvalid={!!errors.title}
					errorMessage={errors.title?.message as string}
				/>
			</Form.Group>

			<Form.Group className='mb-3' controlId='formType'>
				<RequiredLabel text={t('Type')} />
				<SelectField
					options={typeOptions}
					placeholder={tp('selectType')}
					onChange={e => {
						const v = e.target.value;
						const input = document.querySelector(
							'input[name="type"]'
						) as HTMLInputElement | null;
						if (input) input.value = v;
					}}
				/>
				<input
					type='hidden'
					{...register('type', { required: te('required') })}
				/>
				{errors.type?.message ? (
					<div className='invalid-feedback d-block'>
						{errors.type?.message as string}
					</div>
				) : null}
			</Form.Group>

			<Form.Group className='mb-3' controlId='formSpecification'>
				<label className='form-label'>{t('Specification')}</label>
				<TextField {...register('specification')} as='textarea' />
			</Form.Group>

			<Form.Group className='mb-3' controlId='formGuaranteeStart'>
				<RequiredLabel text={t('Guarantee Start')} />
				<TextField
					{...register('guaranteeStart', { required: te('required') })}
					type='date'
					isInvalid={!!errors.guaranteeStart}
					errorMessage={errors.guaranteeStart?.message as string}
				/>
			</Form.Group>

			<Form.Group className='mb-3' controlId='formGuaranteeEnd'>
				<RequiredLabel text={t('Guarantee End')} />
				<TextField
					{...register('guaranteeEnd', { required: te('required') })}
					type='date'
					isInvalid={!!errors.guaranteeEnd}
					errorMessage={errors.guaranteeEnd?.message as string}
				/>
			</Form.Group>

			<Form.Group className='mb-3' controlId='formPrice'>
				<RequiredLabel text={t('Price')} />
				<SelectField
					options={priceOptions.map(p => ({ value: p.value, label: p.label }))}
					value={selectedPrice?.value}
					onChange={e => handlePriceSelect(e.target.value)}
					placeholder={tp('selectPrice')}
				/>
				<input
					type='hidden'
					{...register('price.value', { required: te('required') })}
					value={selectedPrice?.value ?? ''}
					readOnly
				/>
				<input
					type='hidden'
					{...register('price.symbol', { required: te('required') })}
					value={selectedPrice?.label ?? ''}
					readOnly
				/>
				{errors['price.value'] || errors['price.symbol'] ? (
					<div className='invalid-feedback d-block'>{te('required')}</div>
				) : null}
			</Form.Group>

			<Form.Group className='mb-3' controlId='formOrders'>
				<label className='form-label'>{t('Orders')} (optional)</label>
				<MultiSelectField
					options={orderOptions}
					value={selectedOrders}
					onChange={handleOrdersChange}
					closeMenuOnSelect={false}
					placeholder={tp('selectOrders')}
				/>
				{selectedOrders.map((o, idx) => (
					<input key={idx} type='hidden' name='orders[]' value={o.value} />
				))}
			</Form.Group>

			{/* Submission is triggered via Popup onApply custom event */}
			<button
				type='submit'
				hidden
				disabled={isSubmitting || addProductIsPending}
			/>
		</form>
	);
};
