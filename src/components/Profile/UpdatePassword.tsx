'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { ErrorServer } from '@/components/ui/ErrorServer/ErrorServer';
import { TextField } from '@/components/ui/TextField/TextField';

import { PASSWORD_PATTERN } from '@/utils/regExp';

import type { TPasswordFormData } from '../../hooks/profile/types';
import { usePasswordActions } from '../../hooks/profile/usePasswordActions';

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

	const onFormSubmit = (data: TPasswordFormData) => {
		onPasswordSubmit(data, locale);
	};

	const newPassword = watch('newPassword');

	return (
		<Card>
			<Card.Body>
				<h5 className='mb-3'>Update Password</h5>
				<ErrorServer message={state.message} />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='oldPassword'>
						<Form.Label>Old password</Form.Label>
						<TextField
							{...register('oldPassword', {
								required: te('required')
							})}
							type='password'
							placeholder='Enter old password'
							isInvalid={!!errors.oldPassword}
							errorMessage={errors.oldPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='newPassword'>
						<Form.Label>New password</Form.Label>
						<TextField
							{...register('newPassword', {
								required: te('required'),
								validate: value =>
									PASSWORD_PATTERN.test(value) || te('password')
							})}
							type='password'
							placeholder='Enter new password'
							isInvalid={!!errors.newPassword}
							errorMessage={errors.newPassword?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='confirmPassword'>
						<Form.Label>Confirm new password</Form.Label>
						<TextField
							{...register('confirmPassword', {
								required: te('required'),
								validate: value => value === newPassword || te('passwordMatch')
							})}
							type='password'
							placeholder='Confirm new password'
							isInvalid={!!errors.confirmPassword}
							errorMessage={errors.confirmPassword?.message}
						/>
					</Form.Group>

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Apply')}
							type='submit'
							variant='primary'
							disabled={isSubmitting || isPending}
							className='ps-3 pe-3'
						/>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
