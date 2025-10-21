'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { ErrorServer } from '@/components/ui/ErrorServer/ErrorServer';
import { TextField } from '@/components/ui/TextField/TextField';

import { EMAIL_PATTERN, isValidName } from '@/utils/regExp';

import type { TProfileFormData } from '../../hooks/profile/types';
import { useProfileActions } from '../../hooks/profile/useProfileActions';

export const Info = () => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const { data: session } = useSession();

	const defaultValues: TProfileFormData = {
		name: session?.user?.name ?? '',
		email: session?.user?.email ?? ''
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TProfileFormData>({ mode: 'onBlur', defaultValues });

	const { onProfileSubmit, state, isPending } = useProfileActions();

	const onFormSubmit = (data: TProfileFormData) => {
		onProfileSubmit(data, locale);
	};

	return (
		<Card className='mb-4'>
			<Card.Body>
				<h5 className='mb-3'>{t('Profile.info.title')}</h5>
				<ErrorServer message={state.message} />
				<Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
					<Form.Group className='mb-3' controlId='name'>
						<Form.Label>{t('Profile.info.fields.name')}</Form.Label>
						<TextField
							{...register('name', {
								validate: value => {
									if (!value) return true;
									return isValidName(value) || te('name');
								}
							})}
							type='text'
							placeholder={t('Profile.info.placeholders.name')}
							isInvalid={!!errors.name}
							errorMessage={errors.name?.message}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='email'>
						<Form.Label>{t('Profile.info.fields.email')}</Form.Label>
						<TextField
							{...register('email', {
								required: te('required'),
								validate: value => EMAIL_PATTERN.test(value) || te('email')
							})}
							type='email'
							placeholder={t('Profile.info.placeholders.email')}
							isInvalid={!!errors.email}
							errorMessage={errors.email?.message}
						/>
					</Form.Group>

					<div className='d-flex align-items-center justify-content-center'>
						<Button
							text={t('Apply')}
							type='submit'
							variant='success'
							disabled={isSubmitting || isPending}
							className='ps-3 pe-3'
						/>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
