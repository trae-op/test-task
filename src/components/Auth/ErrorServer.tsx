import { useTranslations } from 'next-intl';

import type { TErrorServerProps } from './types';

export const ErrorServer = ({ message }: TErrorServerProps) => {
	const t = useTranslations('App.auth.errors');

	if (!message) {
		return null;
	}

	return <div className='mb-1 text-danger'>{t(message)}</div>;
};
