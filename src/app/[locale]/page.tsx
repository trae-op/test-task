// import IndependentComponents from './IndependentComponents';
import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function Home() {
	const user = await getServerSession();
	const locale = await getLocale();

	if (!user) {
		redirect(`/${locale}/sign-in`);
	} else {
		redirect(`/${locale}/orders`);
	}
}
