'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { type Area } from 'react-easy-crop';

import { Button } from '@/components/Button';
import { useActions } from '@/components/Toaster/useActions';

import { uploadPicture } from '@/services/imageUpload';

import { getCroppedImg } from '@/utils/imageUpload';

import styles from './ImageUpload.module.scss';
import { ImageUploadTProps } from './types';

const BLOCK = 'upload';

export const ImageUpload = ({
	pendingUpload = false,
	handleFail,
	handleSuccess,
	imageOptions,
	entity,
	handleBeforeSuccess
}: ImageUploadTProps) => {
	const t = useTranslations('App');
	const { setToast } = useActions();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [croppedArea, setCroppedArea] = useState<Area | null>(null);
	const [zoom, setZoom] = useState(1);

	const onDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.onload = () => {
			setImageSrc(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: { 'image/*': [] }
	});

	const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedArea(croppedAreaPixels);
	};

	const handleSave = async () => {
		if (!imageSrc || !croppedArea) return;
		if (handleBeforeSuccess !== undefined) {
			handleBeforeSuccess();
		}

		const croppedImage = await getCroppedImg(imageSrc, croppedArea);
		const formData = new FormData();

		formData.append('imageOptions', JSON.stringify(imageOptions));
		formData.append('file', croppedImage);

		try {
			const response = await uploadPicture<{
				message: string;
				ok: boolean;
				data: { url: string };
			}>(`upload/${entity}`, formData);
			if (response.results.ok) {
				if (handleSuccess !== undefined) {
					handleSuccess(response.results);
				}
			}
		} catch (error) {
			if (error instanceof Response) {
				const { message } = await error.json();
				setToast(`${error.status}: ${message}`, 'error');
				if (handleFail !== undefined) {
					handleFail();
				}
			}
		}
	};

	const handleChangeRange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setZoom(Number(event.target.value));
	};

	const handleClear = () => {
		setImageSrc(null);
		setCroppedArea(null);
		setZoom(1);
	};

	return (
		<div className='d-flex flex-column align-items-center gap-2 w-100'>
			<div className={clsx(styles[BLOCK], 'w-100')}>
				<div
					className={clsx(
						styles[`${BLOCK}__container`],
						'px-2 py-5 text-center d-flex flex-column justify-content-center align-items-center'
					)}
				>
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<span className='text-sm'>
							{t('Drag and drop an image, or click to select one')}
						</span>
					</div>
				</div>
				{imageSrc && (
					<>
						<div className={clsx(styles[`${BLOCK}__cropper`], 'w-100')}>
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={1}
								onCropChange={setCrop}
								onCropComplete={onCropComplete}
								onZoomChange={setZoom}
							/>
						</div>
					</>
				)}
			</div>

			{imageSrc && (
				<input
					type='range'
					value={zoom}
					min={1}
					max={3}
					step={0.1}
					aria-labelledby='Zoom'
					onChange={handleChangeRange}
					className='w-100'
				/>
			)}

			<div className='d-flex items-center justify-content-center gap-2'>
				<Button
					disabled={pendingUpload || imageSrc === null}
					isLoading={pendingUpload}
					variant='success'
					text={t('Apply')}
					onClick={handleSave}
				/>

				{imageSrc && (
					<Button variant='secondary' text={t('Clear')} onClick={handleClear} />
				)}
			</div>
		</div>
	);
};
