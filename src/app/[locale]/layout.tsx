import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { AuthProvider } from '@/components/Auth';

import type { TLocaleLayoutProps } from './types';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
	children,
	params
}: TLocaleLayoutProps) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const messages = (await import(`../../../messages/${locale}.json`)).default;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<AuthProvider>{children}</AuthProvider>
		</NextIntlClientProvider>
	);
}
