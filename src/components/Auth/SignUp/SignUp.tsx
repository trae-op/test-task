'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { startTransition, useActionState } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { type TSignUpFormData } from '@/components/Auth/SignUp/types';
import { Button } from '@/components/ui/Button';
import { RequiredLabel } from '@/components/ui/RequiredLabel';
import { TextField } from '@/components/ui/TextField';

import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';

import { signUpSubmit } from '@/actions/auth/signUp/submit';
import type { TSignUpSubmitState } from '@/actions/auth/signUp/types';

export const SignUp = () => {
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const t = useTranslations('App.auth.signUp');
	const tp = useTranslations('App.auth.placeholders');
	const te = useTranslations('App.errors');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<TSignUpFormData>({ mode: 'onBlur' });
	const password = watch('password');

	const [state, formAction, isPending] = useActionState<
		TSignUpSubmitState,
		FormData
	>(signUpSubmit, { ok: false });

	const onSubmit = (data: TSignUpFormData) => {
		const fd = new FormData();
		fd.append('locale', locale);
		fd.append('name', data.name);
		fd.append('email', data.email);
		fd.append('password', data.password);
		fd.append('confirmPassword', data.confirmPassword);
		startTransition(() => {
			formAction(fd);
		});
	};

	return (
		<Container>
			<Row className='justify-content-center align-items-center min-vh-100'>
				<Col xs={12} md={6} lg={4}>
					<Card>
						<Card.Header as='h4' className='text-center'>
							{t('title')}
						</Card.Header>
						<Card.Body>
							{state.message && (
								<div style={{ color: 'crimson', marginBottom: '1rem' }}>
									{state.message}
								</div>
							)}
							<Form noValidate onSubmit={handleSubmit(onSubmit)}>
								<Form.Group className='mb-3' controlId='formName'>
									<RequiredLabel text={t('name')} />
									<TextField
										{...register('name', {
											required: te('required'),
											pattern: { value: NAME_PATTERN, message: te('name') }
										})}
										type='text'
										placeholder={tp('enterName')}
										isInvalid={!!errors.name}
										errorMessage={errors.name?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formEmail'>
									<RequiredLabel text={t('email')} />
									<TextField
										{...register('email', {
											required: te('required'),
											pattern: { value: EMAIL_PATTERN, message: te('email') }
										})}
										type='email'
										placeholder={tp('enterEmail')}
										isInvalid={!!errors.email}
										errorMessage={errors.email?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formPassword'>
									<RequiredLabel text={t('password')} />
									<TextField
										{...register('password', {
											required: te('required'),
											pattern: {
												value: PASSWORD_PATTERN,
												message: te('password')
											}
										})}
										type='password'
										placeholder={tp('enterPassword')}
										isInvalid={!!errors.password}
										errorMessage={errors.password?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formConfirmPassword'>
									<RequiredLabel text={t('confirmPassword')} />
									<TextField
										{...register('confirmPassword', {
											required: te('required'),
											validate: value =>
												value === password || te('passwordMatch')
										})}
										type='password'
										placeholder={tp('confirmPassword')}
										isInvalid={!!errors.confirmPassword}
										errorMessage={errors.confirmPassword?.message}
									/>
								</Form.Group>

								<Button
									text={t('submitButton')}
									type='submit'
									variant='success'
									className='w-100'
									disabled={isSubmitting || isPending}
								/>

								<div className='text-center mt-3'>
									{t('haveAccount')}{' '}
									<Link href={`/${locale}/sign-in`}>{t('signInLink')}</Link>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
