'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { TResultUploadPicture } from '@/components/ImageUpload/types';
import { Loading } from '@/components/Loading';
import { Picture } from '@/components/Picture';

import { TDynamicPageParams } from '@/types/dynamicPage';

import { getFullPathUploadPicture } from '@/utils/upload-files';
import { uploadsPictures } from '@/utils/upload-files';

import styles from '../styles/UpdateProduct.module.scss';
import { TUpdateFormData } from '../types';

const BLOCK = 'update-product';

const ImageUpload = dynamic(
	() => import('@/components/ImageUpload').then(m => m.ImageUpload),
	{ ssr: false, loading: () => <Loading /> }
);

export const PictureProduct = memo(() => {
	const { data: session } = useSession();
	const params = useParams<TDynamicPageParams>();
	const { watch, setValue } = useFormContext<TUpdateFormData>();
	const picture = watch('photo');

	const [pending, setPending] = useState(false);

	const paramId = params?.id;

	const handleSuccess = useCallback(
		({ data }: TResultUploadPicture) => {
			setPending(false);

			if (session) {
				setValue(
					'photo',
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

	return (
		<div className='d-flex gap-3' data-testid='update-product-picture-section'>
			<Picture
				src={picture || ''}
				alt='Product Picture'
				size='full'
				sizes='100px'
				className={styles[`${BLOCK}__picture`]}
			/>
			{paramId && (
				<ImageUpload
					imageOptions={{
						fileName: uploadsPictures(params.id).fileName,
						folder: uploadsPictures(params.id).folder,
						entityId: params.id || ''
					}}
					entity='product'
					pendingUpload={pending}
					handleBeforeSuccess={handleBeforeSuccess}
					handleSuccess={handleSuccess}
					handleFail={handleFail}
					data-testid='update-product-image-upload'
				/>
			)}
		</div>
	);
});
