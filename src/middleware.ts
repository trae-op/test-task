import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		const segments = pathname.split('/').filter(Boolean);
		const locale = segments[0];
		const isLocalePrefixed = routing.locales.includes(locale as any);
		const isAuthPage =
			isLocalePrefixed &&
			(segments[1] === 'sign-in' || segments[1] === 'sign-up');

		// If someone lands on non-locale '/sign-in' or '/sign-up', redirect to default locale version
		if (
			!isLocalePrefixed &&
			(segments[0] === 'sign-in' || segments[0] === 'sign-up')
		) {
			const url = req.nextUrl.clone();
			url.pathname = `/${routing.defaultLocale}/${segments[0]}`;
			return NextResponse.redirect(url);
		}

		const intlResponse = intlMiddleware(req);
		const token = (req as any).nextauth?.token;
		const isProtected =
			isLocalePrefixed &&
			(segments[1] === 'products' || segments[1] === 'orders');

		// If unauthenticated and hitting protected routes, redirect to locale sign-in explicitly
		if (!token && isProtected) {
			const url = req.nextUrl.clone();
			url.pathname = `/${locale}/sign-in`;
			url.searchParams.set('callbackUrl', req.nextUrl.href);
			return NextResponse.redirect(url);
		}

		if (token && isAuthPage) {
			const url = req.nextUrl.clone();
			url.pathname = `/${locale}`;
			return NextResponse.redirect(url);
		}

		return intlResponse;
	},
	{
		callbacks: {
			authorized: () => true
		},
		pages: { signIn: '/sign-in' },
		secret: process.env.NEXTAUTH_SECRET
	}
);

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
