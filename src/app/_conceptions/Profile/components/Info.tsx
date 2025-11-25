'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button/Button';
import { TResultUploadPicture } from '@/components/ImageUpload/types';
import { Loading } from '@/components/Loading';
import { MessagesServer } from '@/components/MessagesServer/MessagesServer';
import { TextField } from '@/components/TextField/TextField';

import { EMAIL_PATTERN, isValidName } from '@/utils/regExp';
import { getFullPathUploadPicture } from '@/utils/upload-files';
import { uploadsPictures } from '@/utils/upload-files';

import type { TProfileFormData } from '../hooks/types';
import { useProfileActions } from '../hooks/useProfileActions';

import { useSetAvatarProfileDispatch } from '@/context/global/useSelectors';

const ImageUpload = dynamic(
	() => import('@/components/ImageUpload').then(m => m.ImageUpload),
	{ ssr: false, loading: () => <Loading /> }
);

export const Info = memo((defaultValues: TProfileFormData) => {
	const t = useTranslations('App');
	const te = useTranslations('App.errors');
	const { data: session } = useSession();

	const setAvatarProfile = useSetAvatarProfileDispatch();

	const params = useParams();
	const [pending, setPending] = useState(false);
	const locale = (params?.locale as string) || '';

	const handleSuccess = useCallback(
		({ data }: TResultUploadPicture) => {
			setPending(false);

			if (session) {
				setAvatarProfile(
					getFullPathUploadPicture({
						url: data.url
					})
				);
			}
		},
		[session]
	);

	const handleBeforeSuccess = () => {
		setPending(true);
	};

	const handleFail = () => {
		setPending(false);
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<TProfileFormData>({ mode: 'onBlur', defaultValues });

	const { onProfileSubmit, state, isPending } = useProfileActions();
	const isLoading = isSubmitting || isPending;

	const onFormSubmit = (data: TProfileFormData) => {
		onProfileSubmit(data, locale);
	};

	return (
		<Card className='mb-4'>
			<Card.Body>
				<h5 className='mb-3'>{t('Profile Info')}</h5>
				<MessagesServer
					message={state.message}
					type={state.ok ? 'success' : 'error'}
				/>
				<Row>
					<Col xs={12} lg={6} className='d-flex justify-content-center'>
						<ImageUpload
							imageOptions={{
								fileName: uploadsPictures(defaultValues.id).fileName,
								folder: uploadsPictures(defaultValues.id).folder,
								entityId: session?.user.id || ''
							}}
							entity='profile'
							pendingUpload={pending}
							handleBeforeSuccess={handleBeforeSuccess}
							handleSuccess={handleSuccess}
							handleFail={handleFail}
						/>
					</Col>
					<Col xs={12} lg={6}>
						<Form
							className='w-100'
							noValidate
							onSubmit={handleSubmit(onFormSubmit)}
						>
							<Form.Group className='mb-3' controlId='name'>
								<Form.Label>{t('Name')}</Form.Label>
								<TextField
									{...register('name', {
										validate: value => {
											if (!value) return true;
											return isValidName(value) || te('name');
										}
									})}
									type='text'
									placeholder={t('Enter your name')}
									isInvalid={!!errors.name}
									errorMessage={errors.name?.message}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='email'>
								<Form.Label>{t('Email address')}</Form.Label>
								<TextField
									{...register('email', {
										required: t('This field is required'),
										validate: value => EMAIL_PATTERN.test(value) || te('email')
									})}
									type='email'
									placeholder={t('Enter your email')}
									isInvalid={!!errors.email}
									errorMessage={errors.email?.message}
								/>
							</Form.Group>

							<div className='d-flex align-items-center justify-content-center'>
								<Button
									text={t('Apply')}
									type='submit'
									variant='success'
									isLoading={isLoading}
									disabled={isLoading}
								/>
							</div>
						</Form>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
});
