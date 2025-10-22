import { NextIntlClientProvider } from 'next-intl';

import { NotFound } from '@/components/NotFound';

export default function NotFoundPage() {
	return (
		<NextIntlClientProvider>
			<NotFound />
		</NextIntlClientProvider>
	);
}
