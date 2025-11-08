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
	const AUTH_PAGES = new Set(['sign-in', 'sign-up']);
	const isAuthPage = AUTH_PAGES.has(firstAfterLocale);
	const locale = hasLocaleInPath ? maybeLocale : routing.defaultLocale;
	const to = (path: string) => new URL(path, req.url);
	const isProtected = hasLocaleInPath && firstAfterLocale !== '' && !isAuthPage;

	const isHttps =
		req.headers.get('x-forwarded-proto') === 'https' ||
		req.nextUrl.protocol === 'https:';

	const token = await getToken({
		req,
		secureCookie: isHttps
	});

	const isAuthenticated = Boolean(token?.email && token?.id);

	if (isAuthenticated && isAuthPage) {
		return NextResponse.redirect(to(`/${locale}/orders`));
	}

	if (isProtected && !isAuthenticated) {
		const from = encodeURIComponent(pathname + (search || ''));
		return NextResponse.redirect(to(`/${locale}/sign-in?callbackUrl=${from}`));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/:locale([a-z]{2,})/:path*']
};
