'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { MessagesServer } from '@/components/MessagesServer';
import { RequiredLabel } from '@/components/RequiredLabel';
import { TextField } from '@/components/TextField';

import { useAuthActions } from '@/hooks/auth';

import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';

import { type TSignUpFormData } from '@/app/_conceptions/Auth/SignUp/types';

export const SignUp = () => {
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const t = useTranslations('App');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<TSignUpFormData>({ mode: 'onBlur' });
	const password = watch('password');

	const { onSignUpSubmit, signUpState, signUpIsPending } = useAuthActions();
	const isLoading = isSubmitting || signUpIsPending;

	return (
		<Container>
			<Row className='align-items-center justify-content-center min-vh-100'>
				<Col xs={12} md={6} lg={4}>
					<Card>
						<Card.Header as='h4' className='text-center'>
							{t('Sign Up')}
						</Card.Header>
						<Card.Body>
							<MessagesServer message={signUpState.message} type='error' />
							<Form noValidate onSubmit={handleSubmit(onSignUpSubmit)}>
								<Form.Group className='mb-3' controlId='formName'>
									<RequiredLabel text={t('Name')} />
									<TextField
										{...register('name', {
											required: t('This field is required'),
											pattern: { value: NAME_PATTERN, message: t('Name') }
										})}
										type='text'
										placeholder={t('Enter your name')}
										isInvalid={!!errors.name}
										errorMessage={errors.name?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formEmail'>
									<RequiredLabel text={t('Email address')} />
									<TextField
										{...register('email', {
											required: t('This field is required'),
											pattern: {
												value: EMAIL_PATTERN,
												message: t('Email address')
											}
										})}
										type='email'
										placeholder={t('Enter your email')}
										isInvalid={!!errors.email}
										errorMessage={errors.email?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formPassword'>
									<RequiredLabel text={t('Password')} />
									<TextField
										{...register('password', {
											required: t('This field is required'),
											pattern: {
												value: PASSWORD_PATTERN,
												message: t('Password')
											}
										})}
										type='password'
										placeholder={t('Enter your password')}
										isInvalid={!!errors.password}
										errorMessage={errors.password?.message}
									/>
								</Form.Group>

								<Form.Group className='mb-3' controlId='formConfirmPassword'>
									<RequiredLabel text={t('Confirm password')} />
									<TextField
										{...register('confirmPassword', {
											required: t('This field is required'),
											validate: value =>
												value === password || t('Passwords must match')
										})}
										type='password'
										placeholder={t('Confirm your password')}
										isInvalid={!!errors.confirmPassword}
										errorMessage={errors.confirmPassword?.message}
									/>
								</Form.Group>

								<Button
									text={t('Submit')}
									type='submit'
									variant='success'
									className='w-100'
									isLoading={isLoading}
									disabled={isLoading}
								/>

								<div className='mt-3 text-center'>
									{t('Have an account?')}{' '}
									<Link href={`/${locale}/sign-in`}>{t('Sign In')}</Link>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
