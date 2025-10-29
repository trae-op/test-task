'use client';

import { useTranslations } from 'next-intl';

import { useEntitiesTitleSelector } from '@/context/global/useContext';

export const Title = () => {
	const t = useTranslations('App');
	const title = useEntitiesTitleSelector();

	return <span>{title ? t(title) : ''}</span>;
};
