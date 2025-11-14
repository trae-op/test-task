'use client';

import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';

import type { TAddOrderFormData } from '../types';

export const SubmitButton = () => {
	const t = useTranslations('App');
	const { formState } = useFormContext<TAddOrderFormData>();
	const { pending } = useFormStatus();
	const isLoading = formState.isSubmitting || pending;

	return (
		<div className='d-flex align-items-center justify-content-center'>
			<Button
				text={t('Submit')}
				type='submit'
				variant='success'
				isLoading={isLoading}
				disabled={isLoading}
				className='ps-3 pe-3'
			/>
		</div>
	);
};
