'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button/Button';
import { MessagesServer } from '@/components/MessagesServer/MessagesServer';
import { TextField } from '@/components/TextField/TextField';

import { PASSWORD_PATTERN } from '@/utils/regExp';

import type { TPasswordFormData } from '../hooks/types';
import { usePasswordActions } from '../hooks/usePasswordActions';

export const UpdatePassword = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<TPasswordFormData>({ mode: 'onBlur' });

	const { onPasswordSubmit, state, isPending } = usePasswordActions();
	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TPasswordFormData) => {
		onPasswordSubmit(data, locale);
	};

	const newPassword = watch('newPassword');

	return (
		<Card>
			<Card.Body>
				<h5 className='mb-3'>{t('Update Password')}</h5>
				<MessagesServer
					message={state.message}
					type={state.ok ? 'success' : 'error'}
				/>
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='oldPassword'>
						<Form.Label>{t('Old password')}</Form.Label>
						<TextField
							{...register('oldPassword', {
								required: t('This field is required')
							})}
							type='password'
							placeholder={t('Enter old password')}
							isInvalid={!!errors.oldPassword}
							errorMessage={errors.oldPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='newPassword'>
						<Form.Label>{t('New password')}</Form.Label>
						<TextField
							{...register('newPassword', {
								required: t('This field is required'),
								validate: value =>
									PASSWORD_PATTERN.test(value) || te('password')
							})}
							type='password'
							placeholder={t('Enter new password')}
							isInvalid={!!errors.newPassword}
							errorMessage={errors.newPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='confirmPassword'>
						<Form.Label>{t('Confirm new password')}</Form.Label>
						<TextField
							{...register('confirmPassword', {
								required: t('This field is required'),
								validate: value =>
									value === newPassword || t('Passwords must match')
							})}
							type='password'
							placeholder={t('Enter confirm new password')}
							isInvalid={!!errors.confirmPassword}
							errorMessage={errors.confirmPassword?.message}
						/>
					</Form.Group>

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Apply')}
							type='submit'
							variant='primary'
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
