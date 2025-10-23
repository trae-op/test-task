'use client';

import { useTranslations } from 'next-intl';

import type { TTitleProps } from './types';

export const Title = ({ title }: TTitleProps) => {
	const t = useTranslations('App');

	return <span>{t(title)}</span>;
};
