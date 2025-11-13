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

import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';

import type { TSignInFormData } from './types';

export const SignIn = () => {
	const t = useTranslations('App');
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const { onSignInSubmit, signInError, signUpIsPending } = useAuthActions();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TSignInFormData>({ mode: 'onBlur' });
	const isLoading = isSubmitting || signUpIsPending;

	return (
		<Container>
			<Row className='align-items-center justify-content-center min-vh-100'>
				<Col xs={12} md={6} lg={4}>
					<Card>
						<Card.Header as='h4' className='text-center'>
							{t('Sign In')}
						</Card.Header>
						<Card.Body>
							<MessagesServer message={signInError} type='error' />
							<Form noValidate onSubmit={handleSubmit(onSignInSubmit)}>
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
										placeholder={t('Enter your name')}
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

								<Button
									text={t('Submit')}
									type='submit'
									variant='success'
									className='w-100'
									isLoading={isLoading}
									disabled={isLoading}
								/>

								<div className='mt-3 text-center'>
									{t("Don't have an account?")}{' '}
									<Link href={`/${locale}/sign-up`}>{t('Sign Up')}</Link>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
