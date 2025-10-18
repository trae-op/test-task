// import IndependentComponents from './IndependentComponents';
import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { getOrdersHref, getSignInHref } from '@/utils/routing/routing';

export default async function Home() {
	const user = await getServerSession();
	const locale = await getLocale();

	console.log('user', user);

	if (!user) {
		redirect(`/${locale}/${getSignInHref()}`);
	} else {
		redirect(`/${locale}/${getOrdersHref()}`);
	}
}
