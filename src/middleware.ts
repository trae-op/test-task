import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';

export default async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;
	const segments = pathname.split('/').filter(Boolean);

	const locales = routing.locales as readonly string[];
	const maybeLocale = segments[0] || '';
	const hasLocaleInPath = locales.includes(maybeLocale);
	const firstAfterLocale = hasLocaleInPath
		? segments[1] || ''
		: segments[0] || '';

	const isAuthPage =
		firstAfterLocale === 'sign-in' || firstAfterLocale === 'sign-up';
	// Consider any localized, non-auth page as protected by default
	const isProtected = hasLocaleInPath && firstAfterLocale !== '' && !isAuthPage;

	const token = await getToken({
		req,
		secureCookie: process.env.NODE_ENV === 'production'
	});
	const isAuthenticated = Boolean(token);

	// If user is authenticated and hits sign-in/up -> redirect to locale home
	if (isAuthenticated && isAuthPage) {
		const locale = hasLocaleInPath ? maybeLocale : routing.defaultLocale;
		return NextResponse.redirect(new URL(`/${locale}/orders`, req.url));
	}

	// If route is protected and user not authenticated -> redirect to sign-in (root)
	if (isProtected && !isAuthenticated) {
		const from = encodeURIComponent(pathname + (search || ''));
		const locale = hasLocaleInPath ? maybeLocale : routing.defaultLocale;
		return NextResponse.redirect(
			new URL(`/${locale}/sign-in?callbackUrl=${from}`, req.url)
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Run on all localized pages
		'/:locale([a-z]{2,})/:path*'
	]
};
