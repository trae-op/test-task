'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { SyntheticEvent, memo, useMemo, useState } from 'react';

import styles from './Picture.module.scss';
import { PictureError } from './PictureError';
import { PicturePlaceholder } from './PicturePlaceholder';
import type { TPictureProps } from './types';

const BLOCK = 'picture';
const sizeMap = { sm: 40, md: 80, lg: 120, xl: 160 } as const;

export const Picture = memo(
	({
		size = 'md',
		className,
		width,
		height,
		onError,
		onLoad,
		aspectRatio,
		fit = 'cover',
		alt = '',
		...rest
	}: TPictureProps & { alt?: string }) => {
		const [isLoading, setIsLoading] = useState(true);
		const [hasError, setHasError] = useState(false);

		const isFull = size === 'full';

		const imageSize = useMemo(() => {
			if (isFull) return undefined;
			if (width && height) return { width, height };
			if (sizeMap[size]) return { width: sizeMap[size], height: sizeMap[size] };
			return { width: 80, height: 80 };
		}, [isFull, width, height, size]);

		const containerClassName = useMemo(
			() => clsx(styles[BLOCK], styles[`${BLOCK}__${size}`], className),
			[size, className]
		);

		const imageClassName = useMemo(
			() =>
				clsx(
					styles[`${BLOCK}__image`],
					isLoading && styles[`${BLOCK}__image--hidden`],
					isFull && styles[`${BLOCK}__full`]
				),
			[isLoading, isFull]
		);

		const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
			setIsLoading(false);
			onLoad?.(event);
		};

		const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
			setIsLoading(false);
			setHasError(true);
			onError?.(event);
		};

		const iconSize = useMemo(() => {
			const base = size && size !== 'full' ? sizeMap[size] : 80;
			return Math.floor(base * 0.3);
		}, [size]);

		return (
			<div
				className={containerClassName}
				style={aspectRatio ? { aspectRatio } : undefined}
			>
				<PicturePlaceholder isLoading={isLoading} />
				<PictureError hasError={hasError} size={iconSize} />
				<Image
					className={imageClassName}
					onLoad={handleLoad}
					onError={handleError}
					style={{ objectFit: fit }}
					alt={alt}
					{...(isFull
						? { fill: true, sizes: rest.sizes ?? '100vw' }
						: (imageSize as { width: number; height: number }))}
					{...rest}
				/>
			</div>
		);
	}
);
