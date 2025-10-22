import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import type { TMessagesServerProps } from './types';

export const MessagesServer = ({ message, type }: TMessagesServerProps) => {
	const te = useTranslations('App.errors');
	const ts = useTranslations('App.success');

	if (!message) {
		return null;
	}

	return (
		<div
			className={clsx('mb-1', {
				'text-danger': type === 'error',
				'text-success': type === 'success'
			})}
		>
			{type === 'error' ? te(message) : ts(message)}
		</div>
	);
};
