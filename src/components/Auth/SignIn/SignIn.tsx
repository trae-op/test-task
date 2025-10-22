'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { ErrorServer } from '@/components/ui/ErrorServer';
import { RequiredLabel } from '@/components/ui/RequiredLabel';
import { TextField } from '@/components/ui/TextField';

import { useAuthActions } from '@/hooks/auth';

import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';

import type { TSignInFormData } from './types';

export const SignIn = () => {
	const t = useTranslations('App.auth.signIn');
	const tp = useTranslations('App.auth.placeholders');
	const te = useTranslations('App.errors');
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
			<Row className='justify-content-center align-items-center min-vh-100'>
				<Col xs={12} md={6} lg={4}>
					<Card>
						<Card.Header as='h4' className='text-center'>
							{t('title')}
						</Card.Header>
						<Card.Body>
							<ErrorServer message={signInError} />
							<Form noValidate onSubmit={handleSubmit(onSignInSubmit)}>
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

								<Button
									text={t('submitButton')}
									type='submit'
									variant='success'
									className='w-100'
									isLoading={isLoading}
									disabled={isLoading}
								/>

								<div className='text-center mt-3'>
									{t('noAccount')}{' '}
									<Link href={`/${locale}/sign-up`}>{t('signUpLink')}</Link>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
