'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

import { ImageUpload } from '@/components/ImageUpload';
import { TResultUploadPicture } from '@/components/ImageUpload/types';
import { Picture } from '@/components/Picture';

import { TDynamicPageParams } from '@/types/dynamicPage';

import { getFullPathUploadPicture } from '@/utils/upload-files';
import { uploadsPictures } from '@/utils/upload-files';

import { TUpdateFormData } from './types';

export const PictureProduct = memo(() => {
	const { data: session } = useSession();
	const params = useParams<TDynamicPageParams>();
	const { watch, setValue } = useFormContext<TUpdateFormData>();
	const picture = watch('photo');

	const [pending, setPending] = useState(false);

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

	console.log('PictureProduct render', picture);

	return (
		<Row>
			<Col xs={12} lg={4}>
				<Picture
					src={picture || ''}
					alt='Product Picture'
					size='full'
					sizes='100px'
					className='h-50'
				/>
			</Col>
			<Col xs={12} lg={8}>
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
				/>
			</Col>
		</Row>
	);
});
