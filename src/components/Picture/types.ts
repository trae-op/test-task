import { type ImageProps } from 'next/image';

export type TPictureProps = ImageProps & {
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	aspectRatio?: number | string;
	fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	containerErrorClassName?: string;
};
