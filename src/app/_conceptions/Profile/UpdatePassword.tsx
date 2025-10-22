'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button/Button';
import { MessagesServer } from '@/components/MessagesServer/MessagesServer';
import { TextField } from '@/components/TextField/TextField';

import { PASSWORD_PATTERN } from '@/utils/regExp';

import type { TPasswordFormData } from '../../../hooks/profile/types';
import { usePasswordActions } from '../../../hooks/profile/usePasswordActions';

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
				<h5 className='mb-3'>{t('Profile.password.title')}</h5>
				<MessagesServer
					message={state.message}
					type={state.ok ? 'success' : 'error'}
				/>
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='oldPassword'>
						<Form.Label>{t('Profile.password.fields.oldPassword')}</Form.Label>
						<TextField
							{...register('oldPassword', {
								required: te('required')
							})}
							type='password'
							placeholder={t('Profile.password.placeholders.oldPassword')}
							isInvalid={!!errors.oldPassword}
							errorMessage={errors.oldPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='newPassword'>
						<Form.Label>{t('Profile.password.fields.newPassword')}</Form.Label>
						<TextField
							{...register('newPassword', {
								required: te('required'),
								validate: value =>
									PASSWORD_PATTERN.test(value) || te('password')
							})}
							type='password'
							placeholder={t('Profile.password.placeholders.newPassword')}
							isInvalid={!!errors.newPassword}
							errorMessage={errors.newPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='confirmPassword'>
						<Form.Label>
							{t('Profile.password.fields.confirmPassword')}
						</Form.Label>
						<TextField
							{...register('confirmPassword', {
								required: te('required'),
								validate: value => value === newPassword || te('passwordMatch')
							})}
							type='password'
							placeholder={t('Profile.password.placeholders.confirmPassword')}
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
