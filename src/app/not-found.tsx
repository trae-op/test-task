import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { getUserSession } from '@/utils/session';

export default async function NotFoundPage() {
	const userSession = await getUserSession();
	const locale = await getLocale();

	if (userSession === null) {
		redirect(`/${locale}/sign-in`);
	}

	redirect(`/${locale}/orders`);
}
