'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { RequiredLabel } from '@/components/ui/RequiredLabel';
import { TextField } from '@/components/ui/TextField';

import { useAuthActions } from '@/hooks/auth';

import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/utils/regExp';
import { getOrdersHref } from '@/utils/routing/routing';

import type { TSignInFormData } from './types';

export const SignIn = () => {
	const t = useTranslations('App.auth.signIn');
	const tp = useTranslations('App.auth.placeholders');
	const te = useTranslations('App.errors');
	const tae = useTranslations('App.auth.errors');
	const router = useRouter();
	const params = useParams();
	const locale = (params?.locale as string) || '';
	const { signIn } = useAuthActions();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TSignInFormData>({ mode: 'onBlur' });

	const onSubmit = async (data: TSignInFormData) => {
		setError(null);
		const res = await signIn(data.email, data.password);
		if (!res.ok) {
			const message =
				res.error === 'CredentialsSignin' ? 'invalidCredentials' : 'default';
			setError(message);
			return;
		}
		router.push(`/${locale}/${getOrdersHref()}`);
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
							{error && (
								<div style={{ color: 'crimson', marginBottom: '1rem' }}>
									{tae(error)}
								</div>
							)}
							<Form noValidate onSubmit={handleSubmit(onSubmit)}>
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
									disabled={isSubmitting}
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
